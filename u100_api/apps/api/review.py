"""Planner review, approve, and metrics. Edits are logged on the package."""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from typing import Any

from apps.api import store

PLANNER = "Fatima Al-Harthy"


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def public(doc: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in doc.items() if not str(k).startswith("_")}


def _locked(doc: dict[str, Any]) -> bool:
    return doc.get("status") == "approved"


def _log(doc: dict[str, Any], *, field: str, before: Any, after: Any, kind: str, by: str) -> None:
    edits = list(doc.get("edits") or [])
    edits.append({"at": _now(), "by": by, "field": field, "before": before, "after": after, "kind": kind})
    doc["edits"] = edits
    if doc.get("status") == "drafted" and kind != "approve":
        doc["status"] = "reviewed"


def normalize(doc: dict[str, Any]) -> dict[str, Any]:
    flags = []
    for f in doc.get("fields", {}).get("flags") or []:
        row = dict(f)
        row.setdefault("status", "open")
        flags.append(row)
    if "fields" in doc:
        doc["fields"]["flags"] = flags
    doc.setdefault("edits", [])
    doc.setdefault("notes", "")
    return doc


def apply_edit(canonical: str, field: str, value: Any, reviewer: str = PLANNER) -> dict[str, Any]:
    doc = store.get_package(canonical)
    if not doc:
        raise KeyError(canonical)
    if _locked(doc):
        raise PermissionError("approved")
    normalize(doc)
    fields = doc["fields"]
    if field == "basis":
        before, fields["basis"]["text"] = fields["basis"]["text"], str(value)
    elif field == "scope":
        before, fields["scope"]["text"] = fields["scope"]["text"], str(value)
    elif field == "steps":
        lines = value if isinstance(value, list) else str(value).splitlines()
        lines = [str(s).strip() for s in lines if str(s).strip()]
        before = [s["text"] for s in fields["steps"]["items"]]
        cites = fields["steps"]["items"][0]["citations"] if fields["steps"]["items"] else []
        fields["steps"]["items"] = [{"text": s, "citations": cites} for s in lines]
    elif field == "crew":
        before, fields["crew"]["value"] = fields["crew"].get("value"), str(value)
    elif field == "hours":
        before = fields["hours"].get("value")
        fields["hours"]["value"] = float(value) if value not in (None, "") else None
        fields["hours"]["basis"] = "planner edit"
    elif field == "notes":
        before, doc["notes"] = doc.get("notes") or "", str(value)
    else:
        raise ValueError(field)
    _log(doc, field=field, before=before, after=value if field != "steps" else lines, kind="edit", by=reviewer)
    store.upsert_package(doc)
    return public(doc)


def decide_flag(canonical: str, code: str, action: str, note: str = "", reviewer: str = PLANNER) -> dict[str, Any]:
    doc = store.get_package(canonical)
    if not doc:
        raise KeyError(canonical)
    if _locked(doc):
        raise PermissionError("approved")
    normalize(doc)
    found = False
    for flag in doc["fields"]["flags"]:
        if flag.get("code") == code:
            before = flag.get("status")
            flag["status"] = "accepted" if action == "accept" else "rejected"
            flag["note"] = note
            flag["decidedBy"] = reviewer
            flag["decidedAt"] = _now()
            _log(doc, field=f"flag:{code}", before=before, after=flag["status"], kind="flag", by=reviewer)
            found = True
            break
    if not found:
        raise ValueError(code)
    store.upsert_package(doc)
    return public(doc)


def approve(canonical: str, reviewer: str = PLANNER) -> dict[str, Any]:
    doc = store.get_package(canonical)
    if not doc:
        raise KeyError(canonical)
    if _locked(doc):
        return public(normalize(doc))
    normalize(doc)
    open_flags = [f for f in doc["fields"]["flags"] if f.get("status", "open") == "open"]
    if open_flags:
        raise ValueError("open_flags:" + ",".join(f["code"] for f in open_flags))
    before = doc.get("status")
    doc["status"] = "approved"
    doc["approvedAt"] = _now()
    doc["approvedBy"] = reviewer
    _log(doc, field="status", before=before, after="approved", kind="approve", by=reviewer)
    store.upsert_package(doc)
    return public(doc)


def _parse_ts(raw: str | None) -> datetime | None:
    if not raw:
        return None
    try:
        return datetime.strptime(raw.replace("Z", ""), "%Y-%m-%dT%H:%M:%S")
    except ValueError:
        return None


def metrics(ta_id: str = "TA-2027") -> dict[str, Any]:
    pkgs = [normalize(p) for p in store.list_packages(ta_id)]
    by_status = Counter(p.get("status") or "drafted" for p in pkgs)
    field_counts: Counter[str] = Counter()
    edit_totals = []
    durations = []
    for p in pkgs:
        edits = [e for e in p.get("edits") or [] if e.get("kind") == "edit"]
        edit_totals.append(len(edits))
        for e in edits:
            field_counts[str(e.get("field"))] += 1
        if p.get("status") == "approved":
            start = _parse_ts(p.get("openedAt") or p.get("generatedAt"))
            end = _parse_ts(p.get("approvedAt"))
            if start and end:
                durations.append(max((end - start).total_seconds() / 60.0, 0.0))
    most = [{"field": k, "edits": n} for k, n in field_counts.most_common(8)]
    return {
        "taId": ta_id,
        "packages": len(pkgs),
        "drafted": by_status.get("drafted", 0),
        "reviewed": by_status.get("reviewed", 0),
        "approved": by_status.get("approved", 0),
        "avgEdits": round(sum(edit_totals) / len(edit_totals), 2) if edit_totals else 0,
        "medianMinutesToApprove": round(sorted(durations)[len(durations) // 2], 1) if durations else None,
        "avgMinutesToApprove": round(sum(durations) / len(durations), 1) if durations else None,
        "fieldsEditedMost": most,
        "items": [
            {
                "tagCanonical": p.get("tagCanonical"),
                "status": p.get("status"),
                "edits": len([e for e in p.get("edits") or [] if e.get("kind") == "edit"]),
                "generatedAt": p.get("generatedAt"),
                "approvedAt": p.get("approvedAt"),
            }
            for p in sorted(pkgs, key=lambda x: x.get("tagCanonical") or "")
        ],
    }
