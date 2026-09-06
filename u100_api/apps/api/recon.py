from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd

from apps.api.tags import expected_dwg, expected_pi, expected_sap

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
TODAY = "2026-09-02"
REVIEWER_PLACEHOLDER = None


@dataclass
class Variant:
    tag: str
    expected: str
    confidence: float
    status: str
    rule: str
    note: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def classify_variant(actual: str, expected: str, kind: str) -> Variant:
    if actual == expected:
        return Variant(actual, expected, 1.0, "mapped", "exact_formula")
    if kind == "pi" and actual == f"{expected}_OLD":
        return Variant(
            actual,
            expected,
            0.82,
            "review",
            "pi_old_suffix",
            "Master still stores the legacy PI _OLD alias; clean formula does not.",
        )
    if kind == "dwg" and actual in {f"{expected}A", f"{expected}B"}:
        return Variant(
            actual,
            expected,
            0.80,
            "review",
            "split_bundle_suffix",
            "Drawing tag has an A/B bundle suffix the formula does not emit.",
        )
    if kind == "dwg":
        return Variant(
            actual,
            expected,
            0.55,
            "review",
            "dwg_sequence_mismatch",
            f"Drawing tag {actual} does not match formula {expected}.",
        )
    return Variant(
        actual,
        expected,
        0.40,
        "review",
        "formula_mismatch",
        f"{kind.upper()} tag {actual} does not match formula {expected}.",
    )


def _suggest_unmatched_pi(tag: str, eq: pd.DataFrame) -> tuple[str | None, float, str, str]:
    for _, row in eq.iterrows():
        canonical = row["tag_canonical"]
        clean = expected_pi(canonical)
        if tag == clean and row["tag_pi"] == f"{clean}_OLD":
            return (
                canonical,
                0.78,
                "pi_cutover",
                f"Historian tag matches the clean formula for {canonical}; master still has {row['tag_pi']}.",
            )
        if tag == row["tag_pi"]:
            return canonical, 1.0, "exact_master", "Already on the master PI column."
    return None, 0.0, "unmatched", "No rule produced a candidate."


def _suggest_unmatched_dwg(tag: str, eq: pd.DataFrame) -> tuple[str | None, float, str, str]:
    for _, row in eq.iterrows():
        canonical = row["tag_canonical"]
        master = str(row["tag_dwg"])
        if tag == master:
            return canonical, 1.0, "exact_master", "Already on the master drawing column."
        if master.endswith("A") and tag == master[:-1] + "B":
            return (
                canonical,
                0.74,
                "split_bundle_sibling",
                f"Looks like the other bundle of {canonical} ({master} / {tag}).",
            )
        if master.endswith("B") and tag == master[:-1] + "A":
            return (
                canonical,
                0.74,
                "split_bundle_sibling",
                f"Looks like the other bundle of {canonical} ({master} / {tag}).",
            )
    return None, 0.0, "unmatched", "No rule produced a candidate."


def _source_evidence(tables: dict[str, pd.DataFrame]) -> dict[str, dict[str, Any]]:
    wo = tables["work_orders"].groupby("tag_sap").size().to_dict()
    insp = tables["inspections"].groupby("tag_dwg").size().to_dict()
    docs = tables["documents"].groupby("tag_dwg").size().to_dict()
    sensor = tables["sensor_daily"]
    pi_counts = sensor.groupby("tag_pi").size().to_dict()
    pi_first = sensor.groupby("tag_pi")["date"].min().astype(str).to_dict()
    pi_last = sensor.groupby("tag_pi")["date"].max().astype(str).to_dict()
    return {
        "wo": wo,
        "insp": insp,
        "docs": docs,
        "pi_n": pi_counts,
        "pi_first": pi_first,
        "pi_last": pi_last,
    }


def load_tables() -> dict[str, pd.DataFrame]:
    t = {
        "equipment_master": pd.read_csv(DATA / "equipment_master.csv"),
        "work_orders": pd.read_csv(DATA / "work_orders.csv"),
        "inspections": pd.read_csv(DATA / "inspections.csv"),
        "documents": pd.read_csv(DATA / "documents.csv"),
        "turnaround_scope": pd.read_csv(DATA / "turnaround_scope.csv"),
    }
    pq = DATA / "sensor_daily.parquet"
    cols = ["tag_pi", "date", "signal"]
    t["sensor_daily"] = (
        pd.read_parquet(pq, columns=cols) if pq.exists() else pd.read_csv(DATA / "sensor_daily.csv", usecols=cols)
    )
    return t


def build_recon_docs(tables: dict[str, pd.DataFrame] | None = None) -> list[dict[str, Any]]:
    t = tables or load_tables()
    eq = t["equipment_master"]
    scope = set(t["turnaround_scope"]["tag_canonical"])
    ev = _source_evidence(t)
    docs: list[dict[str, Any]] = []

    for _, row in eq.iterrows():
        canonical = row["tag_canonical"]
        sap = classify_variant(str(row["tag_sap"]), expected_sap(canonical), "sap")
        pi = classify_variant(str(row["tag_pi"]), expected_pi(canonical), "pi")
        dwg = classify_variant(str(row["tag_dwg"]), expected_dwg(canonical), "dwg")
        variants = [sap, pi, dwg]
        flags = [v.rule for v in variants if v.rule != "exact_formula"]
        overall = min(v.confidence for v in variants)
        status = "mapped" if all(v.status == "mapped" for v in variants) else "review"
        docs.append(
            {
                "id": canonical,
                "tagCanonical": canonical,
                "docType": "mapping",
                "description": row["description"],
                "equipmentType": row["equipment_type"],
                "criticality": row["criticality"],
                "service": row["service"],
                "inScope": canonical in scope,
                "sap": sap.as_dict(),
                "pi": pi.as_dict(),
                "dwg": dwg.as_dict(),
                "aliases": [],
                "overallStatus": status,
                "overallConfidence": round(overall, 2),
                "flags": flags,
                "evidence": {
                    "workOrders": int(ev["wo"].get(row["tag_sap"], 0)),
                    "inspections": int(ev["insp"].get(row["tag_dwg"], 0)),
                    "documents": int(ev["docs"].get(row["tag_dwg"], 0)),
                    "sensorRows": int(ev["pi_n"].get(row["tag_pi"], 0)),
                    "sensorFrom": ev["pi_first"].get(row["tag_pi"]),
                    "sensorTo": ev["pi_last"].get(row["tag_pi"]),
                },
                "reviewedBy": REVIEWER_PLACEHOLDER,
                "reviewedAt": None,
                "reviewNote": None,
                "asOf": TODAY,
            }
        )

    master_pi = set(eq["tag_pi"].astype(str))
    master_dwg = set(eq["tag_dwg"].astype(str))
    extra_pi = sorted(set(t["sensor_daily"]["tag_pi"].astype(str)) - master_pi)
    extra_dwg = sorted(
        (set(t["inspections"]["tag_dwg"].astype(str)) | set(t["documents"]["tag_dwg"].fillna("").astype(str)))
        - master_dwg
        - {""}
    )

    for tag in extra_pi:
        suggested, conf, rule, reason = _suggest_unmatched_pi(tag, eq)
        pk = suggested or "_unmatched"
        signals = sorted(t["sensor_daily"].loc[t["sensor_daily"]["tag_pi"] == tag, "signal"].unique().tolist())
        docs.append(
            {
                "id": f"unmatched-pi-{tag}",
                "tagCanonical": pk,
                "docType": "unmatched",
                "sourceSystem": "pi",
                "sourceTag": tag,
                "suggestedCanonical": suggested,
                "confidence": conf,
                "rule": rule,
                "reason": reason,
                "status": "open",
                "evidence": {
                    "sensorRows": int(ev["pi_n"].get(tag, 0)),
                    "sensorFrom": ev["pi_first"].get(tag),
                    "sensorTo": ev["pi_last"].get(tag),
                    "signals": signals,
                },
                "reviewedBy": None,
                "reviewedAt": None,
                "reviewNote": None,
                "asOf": TODAY,
            }
        )

    for tag in extra_dwg:
        suggested, conf, rule, reason = _suggest_unmatched_dwg(tag, eq)
        pk = suggested or "_unmatched"
        insp_n = int(ev["insp"].get(tag, 0))
        doc_n = int(ev["docs"].get(tag, 0))
        docs.append(
            {
                "id": f"unmatched-dwg-{tag}",
                "tagCanonical": pk,
                "docType": "unmatched",
                "sourceSystem": "dwg",
                "sourceTag": tag,
                "suggestedCanonical": suggested,
                "confidence": conf,
                "rule": rule,
                "reason": reason,
                "status": "open",
                "evidence": {"inspections": insp_n, "documents": doc_n},
                "reviewedBy": None,
                "reviewedAt": None,
                "reviewNote": None,
                "asOf": TODAY,
            }
        )

    return docs


def summary(docs: list[dict[str, Any]]) -> dict[str, Any]:
    maps = [d for d in docs if d["docType"] == "mapping"]
    queue = [d for d in docs if d["docType"] == "unmatched"]
    return {
        "equipment": len(maps),
        "mapped": sum(1 for d in maps if d["overallStatus"] == "mapped"),
        "review": sum(1 for d in maps if d["overallStatus"] == "review"),
        "unmatchedOpen": sum(1 for d in queue if d["status"] == "open"),
        "unmatchedAccepted": sum(1 for d in queue if d["status"] == "accepted"),
        "asOf": TODAY,
        "builtAt": _now(),
    }
