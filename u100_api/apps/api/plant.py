"""Assemble the one-screen equipment view from source tables. Facts only."""

from __future__ import annotations

import json
from functools import lru_cache
from typing import Any

import pandas as pd

from apps.api import store
from apps.api.recon import DATA, TODAY


def _jsonable(v: Any) -> Any:
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    if hasattr(v, "item"):
        try:
            return v.item()
        except (ValueError, AttributeError):
            pass
    if pd.isna(v):
        return None
    return v


def _records(df: pd.DataFrame, cols: list[str]) -> list[dict[str, Any]]:
    out = []
    for _, row in df.iterrows():
        out.append({c: _jsonable(row[c]) if c in row.index else None for c in cols})
    return out


@lru_cache(maxsize=1)
def _tables() -> dict[str, pd.DataFrame]:
    t = {
        "equipment_master": pd.read_csv(DATA / "equipment_master.csv"),
        "work_orders": pd.read_csv(DATA / "work_orders.csv"),
        "wo_parts": pd.read_csv(DATA / "wo_parts.csv"),
        "inspections": pd.read_csv(DATA / "inspections.csv"),
        "documents": pd.read_csv(DATA / "documents.csv"),
        "isolation_points": pd.read_csv(DATA / "isolation_points.csv"),
        "permits": pd.read_csv(DATA / "permits.csv"),
        "turnaround_scope": pd.read_csv(DATA / "turnaround_scope.csv"),
    }
    for name in ("work_orders", "wo_parts", "permits"):
        t[name]["wo_id"] = t[name]["wo_id"].astype(str)
    t["inspections"]["insp_id"] = t["inspections"]["insp_id"].astype(str)
    pq = DATA / "sensor_daily.parquet"
    cols = ["tag_pi", "signal", "date", "value", "unit", "quality"]
    t["sensor_daily"] = (
        pd.read_parquet(pq, columns=cols) if pq.exists() else pd.read_csv(DATA / "sensor_daily.csv", usecols=cols)
    )
    t["sensor_daily"]["date"] = pd.to_datetime(t["sensor_daily"]["date"])
    return t


def _mapping(canonical: str) -> dict[str, Any] | None:
    try:
        doc = store.get_doc(canonical, canonical)
    except Exception:
        return None
    if doc and doc.get("docType") == "mapping":
        return doc
    return None


def _resolve(canonical: str) -> dict[str, Any]:
    t = _tables()
    eq = t["equipment_master"]
    hit = eq.loc[eq["tag_canonical"] == canonical]
    if hit.empty:
        raise KeyError(canonical)
    row = hit.iloc[0]
    mapping = _mapping(canonical)
    sap = (mapping or {}).get("sap", {}).get("tag") or row["tag_sap"]
    pi = (mapping or {}).get("pi", {}).get("tag") or row["tag_pi"]
    dwg = (mapping or {}).get("dwg", {}).get("tag") or row["tag_dwg"]
    aliases = list((mapping or {}).get("aliases") or [])
    queue = []
    try:
        queue = store.query_docs(
            "SELECT * FROM c WHERE c.docType = 'unmatched' AND c.tagCanonical = @pk",
            [{"name": "@pk", "value": canonical}],
        )
    except Exception:
        queue = []
    pi_tags = {str(pi)}
    dwg_tags = {str(dwg)}
    for a in aliases:
        if a.get("source") == "pi" and a.get("tag"):
            pi_tags.add(str(a["tag"]))
        if a.get("source") == "dwg" and a.get("tag"):
            dwg_tags.add(str(a["tag"]))
    for q in queue:
        if q.get("status") == "accepted" and q.get("sourceTag"):
            if q.get("sourceSystem") == "pi":
                pi_tags.add(str(q["sourceTag"]))
            if q.get("sourceSystem") == "dwg":
                dwg_tags.add(str(q["sourceTag"]))
    return {
        "row": row,
        "mapping": mapping,
        "sap": str(sap),
        "pi": str(pi),
        "dwg": str(dwg),
        "pi_tags": sorted(pi_tags),
        "dwg_tags": sorted(dwg_tags),
        "aliases": aliases,
        "queue": queue,
    }


def _preferred_signals(available: list[str]) -> list[str]:
    prefer = ["TI_OUT_C", "PDI_BAR", "VIB_MM_S", "SEAL_POT_LEVEL_PCT", "TI_IN_C"]
    ordered = [s for s in prefer if s in available]
    for s in available:
        if s not in ordered:
            ordered.append(s)
    return ordered[:2]


def _sensor_series(pi_tags: list[str]) -> dict[str, Any]:
    sensor = _tables()["sensor_daily"]
    sub = sensor.loc[sensor["tag_pi"].isin(pi_tags)].copy()
    if sub.empty:
        return {"signals": [], "series": {}, "from": None, "to": None, "points": 0, "tagsUsed": pi_tags}
    start = pd.Timestamp("2022-01-01")
    sub = sub.loc[(sub["date"] >= start) & (sub["quality"] == "GOOD")]
    signals = _preferred_signals(sorted(sub["signal"].unique().tolist()))
    sub = sub.loc[sub["signal"].isin(signals)]
    sub["week"] = sub["date"].dt.to_period("W").dt.start_time
    weekly = (
        sub.groupby(["signal", "week"], as_index=False)["value"]
        .median()
        .sort_values(["signal", "week"])
    )
    series: dict[str, list[dict[str, Any]]] = {}
    units: dict[str, str] = {}
    for sig in signals:
        g = weekly.loc[weekly["signal"] == sig]
        series[sig] = [{"date": d.strftime("%Y-%m-%d"), "value": round(float(v), 3)} for d, v in zip(g["week"], g["value"])]
        u = sub.loc[sub["signal"] == sig, "unit"]
        units[sig] = str(u.iloc[0]) if not u.empty else ""
    return {
        "signals": signals,
        "units": units,
        "series": series,
        "from": "2022-01-01",
        "to": TODAY,
        "points": int(sum(len(v) for v in series.values())),
        "tagsUsed": pi_tags,
        "grain": "weekly median, GOOD only",
    }


def equipment_view(canonical: str) -> dict[str, Any]:
    resolved = _resolve(canonical)
    t = _tables()
    row = resolved["row"]
    sap, dwg_tags, pi_tags = resolved["sap"], resolved["dwg_tags"], resolved["pi_tags"]

    wos = t["work_orders"].loc[t["work_orders"]["tag_sap"] == sap].copy()
    wos["basic_start"] = pd.to_datetime(wos["basic_start"])
    wos = wos.sort_values("basic_start")
    last3 = wos.tail(3)
    clean_mask = wos["short_text"].astype(str).str.contains("CLEAN|RGKT|BUNDLE", regex=True)
    cleans = wos.loc[clean_mask]
    last_clean = cleans.tail(1)
    extra_clean = last_clean if not last_clean.empty and last_clean.index[0] not in last3.index else last_clean.iloc[0:0]

    wo_cols = [
        "wo_id",
        "wo_type",
        "basic_start",
        "actual_finish",
        "status",
        "short_text",
        "long_text",
        "planned_hours",
        "actual_hours",
        "crew",
        "work_center",
        "ta_id",
        "priority",
    ]
    shown = pd.concat([last3, extra_clean]).drop_duplicates("wo_id").sort_values("basic_start")
    wo_items = []
    for rec in _records(shown, wo_cols):
        if rec.get("basic_start"):
            rec["basic_start"] = str(rec["basic_start"])[:10]
        if rec.get("actual_finish"):
            rec["actual_finish"] = str(rec["actual_finish"])[:10]
        rec["parts"] = _records(
            t["wo_parts"].loc[t["wo_parts"]["wo_id"] == rec["wo_id"]],
            ["material_no", "material_desc", "qty", "unit"],
        )
        rec["role"] = "last_clean" if rec["wo_id"] in set(last_clean["wo_id"].astype(str)) else "recent"
        wo_items.append(rec)

    insp = t["inspections"].loc[t["inspections"]["tag_dwg"].isin(dwg_tags)].copy()
    insp["insp_date"] = pd.to_datetime(insp["insp_date"])
    insp = insp.sort_values("insp_date")
    insp_cols = [
        "insp_id",
        "tag_dwg",
        "insp_date",
        "insp_type",
        "finding_text",
        "fouling_pct",
        "wall_min_mm",
        "vib_mm_s",
        "severity",
        "recommendation",
        "next_insp_due",
    ]
    latest = insp.tail(1)
    recent_insp = insp.tail(3)
    insp_items = _records(recent_insp, insp_cols)
    for rec in insp_items:
        if rec.get("insp_date"):
            rec["insp_date"] = str(rec["insp_date"])[:10]
        if rec.get("next_insp_due"):
            rec["next_insp_due"] = str(rec["next_insp_due"])[:10]

    tagged = t["documents"].loc[t["documents"]["tag_dwg"].isin(dwg_tags)]
    procs = t["documents"].loc[
        (t["documents"]["doc_type"] == "PROCEDURE") & (t["documents"]["equipment_type"] == row["equipment_type"])
    ]
    doc_items = _records(pd.concat([tagged, procs]).drop_duplicates("doc_id"), ["doc_id", "tag_dwg", "doc_type", "title", "rev", "rev_date", "file_path"])

    iso = t["isolation_points"].loc[t["isolation_points"]["tag_dwg"].isin(dwg_tags)]
    iso_items = _records(iso, ["valve_tag", "position", "isolation_type", "pid_doc_id", "tag_dwg"])

    wo_ids = set(shown["wo_id"].astype(str))
    perm = t["permits"].loc[t["permits"]["wo_id"].isin(wo_ids)].sort_values("issued_date")
    perm_items = _records(
        perm,
        ["permit_id", "wo_id", "permit_type", "scaffold", "crane", "gas_test_required", "isolation_certificate", "issued_date", "closed_date", "notes"],
    )

    scope = t["turnaround_scope"].loc[t["turnaround_scope"]["tag_canonical"] == canonical]
    scope_item = _records(scope, ["ta_id", "scope_item", "basis", "basis_ref", "planner", "status"])
    scope_one = scope_item[0] if scope_item else None

    flags: list[dict[str, str]] = []
    if not latest.empty:
        rec = latest.iloc[0]
        open_wos = wos.loc[wos["status"].isin(["OPEN", "REL"])]
        if str(rec["recommendation"]).strip().lower() == "no action" and not open_wos.empty:
            flags.append(
                {
                    "code": "open_wo_vs_no_action",
                    "detail": f"Latest inspection {rec['insp_id']} says No action; {len(open_wos)} WO still OPEN/REL.",
                }
            )
    if scope_one and scope_one.get("basis") == "OPERATIONS_REQUEST" and not scope_one.get("basis_ref"):
        flags.append({"code": "no_inspection_basis", "detail": "TA-2027 item is an operations request with no inspection ref."})
    pids = [d for d in doc_items if d.get("doc_type") == "PID"]
    if pids:
        for d in pids:
            sibs = t["documents"].loc[t["documents"]["doc_id"] == d["doc_id"], "rev"]
            if not sibs.empty and d.get("rev") and d["rev"] != sibs.max():
                flags.append(
                    {
                        "code": "pid_rev_stale",
                        "detail": f"{d['doc_id']} cited rev {d['rev']}; current in index is {sibs.max()}.",
                    }
                )
                break
    open_unmatched = [q for q in resolved["queue"] if q.get("status") == "open"]
    for q in open_unmatched:
        flags.append(
            {
                "code": "unjoined_source_tag",
                "detail": f"{q.get('sourceSystem')} tag {q.get('sourceTag')} does not join the master. Accept it on the recon screen to pull those records in.",
            }
        )
    mapping = resolved["mapping"]
    if mapping and mapping.get("overallStatus") == "review":
        flags.append(
            {
                "code": "mapping_unconfirmed",
                "detail": "Tag mapping is still in the review queue.",
            }
        )

    clean_marks = [
        {"date": str(d)[:10], "wo_id": str(wid), "short_text": txt}
        for d, wid, txt in zip(cleans["basic_start"], cleans["wo_id"], cleans["short_text"])
    ]

    return {
        "asOf": TODAY,
        "identity": {
            "tagCanonical": canonical,
            "description": row["description"],
            "equipmentType": row["equipment_type"],
            "service": row["service"],
            "criticality": row["criticality"],
            "manufacturer": row["manufacturer"],
            "model": row["model"],
            "installYear": int(row["install_year"]),
            "inScope": bool(scope_one),
            "scope": scope_one,
        },
        "joinKeys": {
            "sap": resolved["sap"],
            "pi": resolved["pi"],
            "dwg": resolved["dwg"],
            "piTags": resolved["pi_tags"],
            "dwgTags": resolved["dwg_tags"],
        },
        "workOrders": {
            "source": "SAP PM",
            "join": f"tag_sap = {sap}",
            "total": int(len(wos)),
            "items": wo_items,
        },
        "inspections": {
            "source": "Inspection / APM",
            "join": "tag_dwg in " + ", ".join(dwg_tags),
            "total": int(len(insp)),
            "latest": insp_items[-1] if insp_items else None,
            "recent": insp_items,
        },
        "sensors": {
            "source": "PI historian",
            "join": "tag_pi in " + ", ".join(pi_tags),
            **_sensor_series(pi_tags),
            "cleanJobs": clean_marks,
        },
        "documents": {
            "source": "Document control",
            "join": "tag_dwg in " + ", ".join(dwg_tags),
            "items": doc_items,
            "isolation": iso_items,
        },
        "permits": {
            "source": "Permit to work",
            "join": "wo_id of shown work orders",
            "items": perm_items,
        },
        "flags": flags,
    }


def scope_list(ta_id: str = "TA-2027") -> dict[str, Any]:
    t = _tables()
    eq = t["equipment_master"]
    insp = t["inspections"].copy()
    insp["insp_date"] = pd.to_datetime(insp["insp_date"])
    dwg = dict(zip(eq["tag_canonical"], eq["tag_dwg"]))
    desc = dict(zip(eq["tag_canonical"], eq["description"]))
    kind = dict(zip(eq["tag_canonical"], eq["equipment_type"]))
    crit = dict(zip(eq["tag_canonical"], eq["criticality"]))

    try:
        pkgs = {p.get("tagCanonical"): p for p in store.list_packages(ta_id)}
    except Exception:
        pkgs = {}

    traps_path = DATA / "reconciliation_traps.json"
    missed = []
    if traps_path.exists():
        missed = json.loads(traps_path.read_text()).get("missed_scope") or []

    def latest_insp(canonical: str) -> dict[str, Any] | None:
        tag = dwg.get(canonical)
        if not tag:
            return None
        sub = insp.loc[insp["tag_dwg"] == tag].sort_values("insp_date")
        if sub.empty:
            return None
        row = sub.iloc[-1]
        return {
            "insp_id": str(row["insp_id"]),
            "insp_date": str(row["insp_date"])[:10],
            "recommendation": _jsonable(row["recommendation"]),
            "severity": _jsonable(row["severity"]),
        }

    items: list[dict[str, Any]] = []
    for _, row in t["turnaround_scope"].iterrows():
        tag = row["tag_canonical"]
        pkg = pkgs.get(tag)
        flags = []
        if row["basis"] == "OPERATIONS_REQUEST" and (pd.isna(row["basis_ref"]) or not str(row["basis_ref"]).strip()):
            flags.append({"code": "no_inspection_basis", "detail": "Operations request with no inspection reference."})
        items.append(
            {
                "taId": row["ta_id"],
                "tagCanonical": tag,
                "description": desc.get(tag),
                "equipmentType": kind.get(tag),
                "criticality": crit.get(tag),
                "scopeItem": row["scope_item"],
                "basis": row["basis"],
                "basisRef": None if pd.isna(row["basis_ref"]) else row["basis_ref"],
                "planner": row["planner"],
                "inScope": True,
                "packageStatus": (pkg or {}).get("status") or "not_started",
                "flags": flags,
                "latestInspection": latest_insp(tag),
            }
        )

    for m in missed:
        tag = m["tag_canonical"]
        latest = latest_insp(tag)
        items.append(
            {
                "taId": ta_id,
                "tagCanonical": tag,
                "description": desc.get(tag),
                "equipmentType": kind.get(tag),
                "criticality": crit.get(tag),
                "scopeItem": None,
                "basis": None,
                "basisRef": (latest or {}).get("insp_id"),
                "planner": None,
                "inScope": False,
                "packageStatus": (pkgs.get(tag) or {}).get("status") or "not_started",
                "flags": [{"code": "recommended_not_in_scope", "detail": m.get("note") or "Inspection recommended TA work; not on the list."}],
                "latestInspection": latest,
            }
        )

    items.sort(key=lambda x: (not x["inScope"], x["tagCanonical"]))
    return {
        "taId": ta_id,
        "inScope": sum(1 for i in items if i["inScope"]),
        "missed": sum(1 for i in items if not i["inScope"]),
        "noBasis": sum(1 for i in items if any(f["code"] == "no_inspection_basis" for f in i["flags"])),
        "notStarted": sum(1 for i in items if i["inScope"] and i["packageStatus"] == "not_started"),
        "drafted": sum(1 for i in items if i["packageStatus"] == "drafted"),
        "reviewed": sum(1 for i in items if i["packageStatus"] == "reviewed"),
        "approved": sum(1 for i in items if i["packageStatus"] == "approved"),
        "items": items,
    }
