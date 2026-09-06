"""Draft a work package. Facts from queries; model writes prose and steps only."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

from apps.api import store
from apps.api.plant import equipment_view
from apps.api.recon import TODAY
from scripts.azure_text import cached_chat

TA_ID = "TA-2027"
PLANNER = "Fatima Al-Harthy"

SYSTEM = (
    "You draft turnaround work-package prose for a refinery planner. "
    "Use only the supplied facts. Do not invent tag numbers, WO ids, inspection ids, "
    "parts, hours, valves, or permit types. Return JSON only with keys "
    "basis (2-4 sentences: why this work is on TA-2027), "
    "scope (2-3 sentences: what will be done), "
    "steps (array of 5-8 short imperative strings). "
    "If a fact is missing, say so in the prose instead of guessing."
)


def _cite(source: str, ref: str, label: str, excerpt: str | None = None) -> dict[str, Any]:
    return {"source": source, "ref": ref, "label": label, "excerpt": excerpt}


def _parse_json(raw: str) -> dict[str, Any]:
    text = raw.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines)
        if text.startswith("json"):
            text = text[4:].lstrip()
    return json.loads(text)


def _last_clean(view: dict[str, Any]) -> dict[str, Any] | None:
    items = view["workOrders"]["items"]
    for w in items:
        if w.get("role") == "last_clean":
            return w
    cleans = view["sensors"].get("cleanJobs") or []
    if not cleans:
        return None
    last = cleans[-1]
    for w in items:
        if w["wo_id"] == last["wo_id"]:
            return w
    return None


def _sensor_snapshot(view: dict[str, Any]) -> dict[str, Any] | None:
    series = view["sensors"].get("series") or {}
    sig = "TI_OUT_C" if "TI_OUT_C" in series else (view["sensors"].get("signals") or [None])[0]
    if not sig or not series.get(sig):
        return None
    pts = series[sig]
    last = pts[-1]
    unit = (view["sensors"].get("units") or {}).get(sig, "")
    return {"signal": sig, "date": last["date"], "value": last["value"], "unit": unit}


def collect_facts(view: dict[str, Any]) -> dict[str, Any]:
    ident = view["identity"]
    latest = view["inspections"].get("latest")
    clean = _last_clean(view)
    procedure = next((d for d in view["documents"]["items"] if d.get("doc_type") == "PROCEDURE"), None)
    pid = next((d for d in view["documents"]["items"] if d.get("doc_type") == "PID"), None)
    sensor = _sensor_snapshot(view)
    permits = view["permits"]["items"]
    if clean:
        permits = [p for p in permits if p.get("wo_id") == clean["wo_id"]] or permits
    return {
        "tag": ident["tagCanonical"],
        "description": ident["description"],
        "equipmentType": ident["equipmentType"],
        "service": ident["service"],
        "inScope": ident["inScope"],
        "scope": ident.get("scope"),
        "latestInspection": latest,
        "lastClean": clean,
        "procedure": procedure,
        "pid": pid,
        "sensor": sensor,
        "isolation": view["documents"]["isolation"],
        "permits": permits,
        "documents": view["documents"]["items"],
        "viewFlags": view.get("flags") or [],
        "joinKeys": view["joinKeys"],
    }


def _fallback_steps(facts: dict[str, Any]) -> list[str]:
    kind = facts["equipmentType"]
    if kind == "exchanger":
        return [
            "Isolate, drain, and vent per the P&ID isolation list.",
            "Open channel / pull bundle.",
            "Clean tube side and shell side.",
            "Inspect bundle and channel; record as-found condition.",
            "Regasket and box up to procedure torque.",
            "Reinstate blinds and valves; leak check on start-up.",
        ]
    if kind == "psv":
        return [
            "Isolate and remove the PSV.",
            "Transport to the shop for pop test.",
            "Recertify and reinstall with new gaskets.",
        ]
    if kind == "vessel" or kind == "column":
        return [
            "Isolate and gas-test for confined space.",
            "Enter and inspect internals.",
            "Repair / overlay as directed by inspection.",
            "Close up and reinstate.",
        ]
    return [
        "Isolate per the P&ID.",
        "Execute the planned scope.",
        "Inspect and record as-found / as-left.",
        "Reinstate and leak check.",
    ]


def _prose(facts: dict[str, Any]) -> dict[str, Any]:
    payload = {
        "tag": facts["tag"],
        "description": facts["description"],
        "type": facts["equipmentType"],
        "service": facts["service"],
        "onTA2027": facts["inScope"],
        "scopeItem": (facts["scope"] or {}).get("scope_item") if facts["scope"] else None,
        "basisType": (facts["scope"] or {}).get("basis") if facts["scope"] else None,
        "basisRef": (facts["scope"] or {}).get("basis_ref") if facts["scope"] else None,
        "inspection": None
        if not facts["latestInspection"]
        else {
            "id": facts["latestInspection"].get("insp_id"),
            "date": facts["latestInspection"].get("insp_date"),
            "type": facts["latestInspection"].get("insp_type"),
            "fouling_pct": facts["latestInspection"].get("fouling_pct"),
            "wall_min_mm": facts["latestInspection"].get("wall_min_mm"),
            "recommendation": facts["latestInspection"].get("recommendation"),
            "finding": (facts["latestInspection"].get("finding_text") or "")[:400],
        },
        "lastClean": None
        if not facts["lastClean"]
        else {
            "wo_id": facts["lastClean"]["wo_id"],
            "date": facts["lastClean"]["basic_start"],
            "short": facts["lastClean"]["short_text"],
            "long": (facts["lastClean"].get("long_text") or "")[:400],
            "hours": facts["lastClean"].get("actual_hours") or facts["lastClean"].get("planned_hours"),
        },
        "procedure": None
        if not facts["procedure"]
        else {"id": facts["procedure"]["doc_id"], "title": facts["procedure"]["title"]},
        "sensor": facts["sensor"],
        "flags": [f["code"] for f in facts["viewFlags"]],
    }
    raw = cached_chat("package_draft", SYSTEM, json.dumps(payload, default=str), temperature=0.2, max_tokens=700)
    try:
        parsed = _parse_json(raw)
    except json.JSONDecodeError:
        parsed = {"basis": raw[:600], "scope": None, "steps": []}
    steps = parsed.get("steps") or []
    if isinstance(steps, str):
        steps = [ln.strip(" -") for ln in steps.splitlines() if ln.strip()]
    if not steps:
        steps = _fallback_steps(facts)
    return {
        "basis": parsed.get("basis") or "Inspection and scope facts were insufficient to write a basis.",
        "scope": parsed.get("scope") or ((facts["scope"] or {}).get("scope_item") if facts["scope"] else "Scope not on TA-2027."),
        "steps": [str(s) for s in steps],
    }


def _build_fields(facts: dict[str, Any], prose: dict[str, Any]) -> dict[str, Any]:
    latest = facts["latestInspection"]
    clean = facts["lastClean"]
    scope = facts["scope"]
    procedure = facts["procedure"]
    pid = facts["pid"]
    sensor = facts["sensor"]

    cites_insp = []
    if latest:
        cites_insp.append(
            _cite(
                "Inspection / APM",
                latest.get("insp_id"),
                f"{latest.get('insp_id')} {latest.get('insp_date')}",
                latest.get("finding_text"),
            )
        )
    cites_scope = []
    if scope:
        cites_scope.append(
            _cite(
                "TA-2027 scope",
                scope.get("ta_id") or "TA-2027",
                scope.get("scope_item"),
                f"basis={scope.get('basis')} ref={scope.get('basis_ref')}",
            )
        )
    cites_wo = []
    if clean:
        cites_wo.append(
            _cite("SAP PM", clean["wo_id"], f"{clean['wo_id']} {clean['short_text']}", clean.get("long_text"))
        )
    cites_proc = []
    if procedure:
        cites_proc.append(_cite("Document control", procedure["doc_id"], procedure["title"], procedure.get("file_path")))
    cites_pid = []
    if pid:
        cites_pid.append(_cite("Document control", pid["doc_id"], f"{pid['doc_id']} rev {pid.get('rev')}", pid.get("title")))
    cites_sensor = []
    if sensor:
        cites_sensor.append(
            _cite(
                "PI historian",
                sensor["signal"],
                f"{sensor['signal']} {sensor['value']} {sensor['unit']} on {sensor['date']}",
                facts["joinKeys"].get("pi"),
            )
        )

    parts = (clean or {}).get("parts") or []
    hours = None
    hours_note = None
    if clean:
        hours = clean.get("actual_hours") or clean.get("planned_hours")
        hours_note = "actual" if clean.get("actual_hours") is not None else "planned"
    permit_types = []
    seen = set()
    for p in facts["permits"]:
        key = p.get("permit_type")
        if key in seen:
            continue
        seen.add(key)
        permit_types.append(
            {
                "permit_type": key,
                "scaffold": p.get("scaffold"),
                "crane": p.get("crane"),
                "gas_test_required": p.get("gas_test_required"),
                "example": p.get("permit_id"),
            }
        )

    flags = list(facts["viewFlags"])
    if not facts["inScope"]:
        flags.append({"code": "not_on_scope", "detail": "Tag is not on the TA-2027 list. Draft is off-list."})
    if scope and scope.get("basis") == "OPERATIONS_REQUEST" and not scope.get("basis_ref"):
        if not any(f["code"] == "no_inspection_basis" for f in flags):
            flags.append({"code": "no_inspection_basis", "detail": "Operations request with no inspection reference."})
    if not clean:
        flags.append({"code": "no_prior_clean", "detail": "No CLEAN/RGKT/BUNDLE work order to copy parts, crew, or hours from."})
    if not procedure:
        flags.append({"code": "no_procedure", "detail": "No procedure document for this equipment type."})
    if hours is not None:
        flags.append(
            {
                "code": "hours_from_last_job",
                "detail": f"Hours copied from {clean['wo_id']} ({hours_note} {hours}). Not a model estimate.",
            }
        )

    return {
        "basis": {"kind": "prose", "text": prose["basis"], "citations": cites_insp + cites_scope + cites_sensor, "fromModel": True},
        "scope": {"kind": "prose", "text": prose["scope"], "citations": cites_scope + cites_wo + cites_proc, "fromModel": True},
        "steps": {
            "kind": "list",
            "items": [{"text": s, "citations": cites_proc + cites_wo} for s in prose["steps"]],
            "fromModel": True,
        },
        "parts": {"kind": "table", "items": parts, "citations": cites_wo, "fromModel": False},
        "crew": {
            "kind": "fact",
            "value": (clean or {}).get("crew"),
            "workCenter": (clean or {}).get("work_center"),
            "citations": cites_wo,
            "fromModel": False,
        },
        "hours": {
            "kind": "fact",
            "value": hours,
            "basis": hours_note,
            "woId": (clean or {}).get("wo_id"),
            "citations": cites_wo,
            "fromModel": False,
        },
        "permits": {"kind": "table", "items": permit_types, "citations": cites_wo, "fromModel": False},
        "isolation": {"kind": "table", "items": facts["isolation"], "citations": cites_pid, "fromModel": False},
        "references": {
            "kind": "table",
            "items": [
                {"doc_id": d["doc_id"], "doc_type": d["doc_type"], "title": d["title"], "rev": d.get("rev")}
                for d in facts["documents"]
            ],
            "fromModel": False,
        },
        "flags": flags,
    }


def generate_package(canonical: str, ta_id: str = TA_ID, planner: str = PLANNER) -> dict[str, Any]:
    existing = store.get_package(canonical, ta_id)
    if existing and existing.get("status") == "approved":
        raise PermissionError("approved")
    view = equipment_view(canonical)
    facts = collect_facts(view)
    prose = _prose(facts)
    fields = _build_fields(facts, prose)
    for flag in fields["flags"]:
        flag.setdefault("status", "open")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    opened = (existing or {}).get("openedAt") or now
    doc = {
        "id": store.package_id(ta_id, canonical),
        "taId": ta_id,
        "tagCanonical": canonical,
        "docType": "package",
        "status": "drafted",
        "asOf": TODAY,
        "openedAt": opened,
        "generatedAt": now,
        "generatedBy": planner,
        "identity": view["identity"],
        "joinKeys": view["joinKeys"],
        "fields": fields,
        "edits": [],
        "notes": "",
        "model": {"role": "basis, scope, steps only", "facts": "queries"},
    }
    try:
        store.upsert_package(doc)
        doc["stored"] = True
    except Exception:
        doc["stored"] = False
    return doc
