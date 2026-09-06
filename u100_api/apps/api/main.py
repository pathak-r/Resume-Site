from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from apps.api import store
from apps.api.draft import generate_package
from apps.api.plant import equipment_view, scope_list
from apps.api.recon import summary as summarise
from apps.api.review import apply_edit, approve, decide_flag, metrics, public as public_pkg
from scripts.common import ENV_PATH

load_dotenv(ENV_PATH)

app = FastAPI(title="Unit 100 work-package drafter", version="0.1.0")

_cors = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5000,http://127.0.0.1:5000",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PLANNER = os.environ.get("PLANNER_NAME", "Fatima Al-Harthy")


class ConfirmBody(BaseModel):
    note: str = ""
    reviewer: str = PLANNER


class QueueDecision(BaseModel):
    action: str = Field(pattern="^(accept|reject)$")
    canonical: str | None = None
    note: str = ""
    reviewer: str = PLANNER


class EditBody(BaseModel):
    field: str
    value: Any
    reviewer: str = PLANNER


class FlagBody(BaseModel):
    code: str
    action: str = Field(pattern="^(accept|reject)$")
    note: str = ""
    reviewer: str = PLANNER


class ApproveBody(BaseModel):
    reviewer: str = PLANNER


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _all() -> list[dict[str, Any]]:
    return store.query_docs("SELECT * FROM c")


def _mappings(docs: list[dict[str, Any]] | None = None) -> list[dict[str, Any]]:
    rows = docs if docs is not None else _all()
    return sorted(
        (d for d in rows if d.get("docType") == "mapping"),
        key=lambda d: (d.get("overallStatus") != "review", d["tagCanonical"]),
    )


def _queue(docs: list[dict[str, Any]] | None = None) -> list[dict[str, Any]]:
    rows = docs if docs is not None else _all()
    return sorted(
        (d for d in rows if d.get("docType") == "unmatched"),
        key=lambda d: (d.get("status") != "open", -float(d.get("confidence") or 0), d["id"]),
    )


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "unit100", "asOf": "2026-09-02"}


@app.get("/api/equipment/{canonical}")
def equipment(canonical: str) -> dict[str, Any]:
    try:
        return equipment_view(canonical)
    except KeyError as exc:
        raise HTTPException(404, f"Unknown tag {canonical}") from exc


@app.get("/api/packages/{canonical}")
def get_draft(canonical: str) -> dict[str, Any]:
    doc = store.get_package(canonical)
    if not doc:
        raise HTTPException(404, f"No package for {canonical}")
    from apps.api.review import normalize

    return public_pkg(normalize(doc))


@app.post("/api/packages/{canonical}/generate")
def post_draft(canonical: str) -> dict[str, Any]:
    try:
        return generate_package(canonical, planner=PLANNER)
    except PermissionError:
        raise HTTPException(409, f"{canonical} is approved and locked")
    except KeyError as exc:
        raise HTTPException(404, f"Unknown tag {canonical}") from exc


@app.post("/api/packages/{canonical}/edit")
def edit_draft(canonical: str, body: EditBody) -> dict[str, Any]:
    try:
        return apply_edit(canonical, body.field, body.value, body.reviewer)
    except PermissionError:
        raise HTTPException(409, "Package is approved and locked")
    except KeyError as exc:
        raise HTTPException(404, f"No package for {canonical}") from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/api/packages/{canonical}/flag")
def flag_draft(canonical: str, body: FlagBody) -> dict[str, Any]:
    try:
        return decide_flag(canonical, body.code, body.action, body.note, body.reviewer)
    except PermissionError:
        raise HTTPException(409, "Package is approved and locked")
    except KeyError as exc:
        raise HTTPException(404, f"No package for {canonical}") from exc
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


@app.post("/api/packages/{canonical}/approve")
def approve_draft(canonical: str, body: ApproveBody) -> dict[str, Any]:
    try:
        return approve(canonical, body.reviewer)
    except KeyError as exc:
        raise HTTPException(404, f"No package for {canonical}") from exc
    except ValueError as exc:
        raise HTTPException(409, str(exc)) from exc


@app.get("/api/metrics")
def get_metrics() -> dict[str, Any]:
    return metrics()


@app.get("/api/scope")
def get_scope() -> dict[str, Any]:
    return scope_list()


@app.get("/api/recon/summary")
def recon_summary() -> dict[str, Any]:
    return summarise(_all())


@app.get("/api/recon/mappings")
def recon_mappings() -> dict[str, Any]:
    docs = _all()
    return {"summary": summarise(docs), "items": _mappings(docs)}


@app.get("/api/recon/queue")
def recon_queue() -> dict[str, Any]:
    docs = _all()
    return {"summary": summarise(docs), "items": _queue(docs)}


@app.get("/api/recon/mappings/{canonical}")
def recon_one(canonical: str) -> dict[str, Any]:
    doc = store.get_doc(canonical, canonical)
    if not doc or doc.get("docType") != "mapping":
        raise HTTPException(404, f"No mapping for {canonical}")
    aliases = [
        d
        for d in store.query_docs(
            "SELECT * FROM c WHERE c.docType = 'unmatched' AND c.tagCanonical = @pk",
            [{"name": "@pk", "value": canonical}],
        )
    ]
    return {"mapping": doc, "queue": aliases}


@app.post("/api/recon/mappings/{canonical}/confirm")
def confirm_mapping(canonical: str, body: ConfirmBody) -> dict[str, Any]:
    doc = store.get_doc(canonical, canonical)
    if not doc or doc.get("docType") != "mapping":
        raise HTTPException(404, f"No mapping for {canonical}")
    doc["overallStatus"] = "mapped"
    doc["reviewedBy"] = body.reviewer
    doc["reviewedAt"] = _now()
    doc["reviewNote"] = body.note or "Planner confirmed the dirty mapping."
    store.replace_doc(doc)
    return doc


@app.post("/api/recon/queue/{item_id}/decide")
def decide_queue(item_id: str, body: QueueDecision) -> dict[str, Any]:
    hits = store.query_docs(
        "SELECT * FROM c WHERE c.id = @id",
        [{"name": "@id", "value": item_id}],
    )
    if not hits:
        raise HTTPException(404, item_id)
    item = hits[0]
    if item.get("docType") != "unmatched":
        raise HTTPException(400, "not a queue item")
    item["status"] = "accepted" if body.action == "accept" else "rejected"
    item["reviewedBy"] = body.reviewer
    item["reviewedAt"] = _now()
    item["reviewNote"] = body.note
    if body.action == "accept":
        canonical = body.canonical or item.get("suggestedCanonical")
        if not canonical:
            raise HTTPException(400, "accept requires a canonical tag")
        item["suggestedCanonical"] = canonical
        mapping = store.get_doc(canonical, canonical)
        if mapping:
            aliases = list(mapping.get("aliases") or [])
            aliases.append(
                {
                    "source": item["sourceSystem"],
                    "tag": item["sourceTag"],
                    "confidence": item.get("confidence"),
                    "rule": item.get("rule"),
                    "acceptedBy": body.reviewer,
                    "acceptedAt": item["reviewedAt"],
                }
            )
            mapping["aliases"] = aliases
            flags = list(mapping.get("flags") or [])
            if item.get("rule") and item["rule"] not in flags:
                flags.append(item["rule"])
            mapping["flags"] = flags
            store.replace_doc(mapping)
    store.replace_doc(item)
    return item


@app.post("/api/recon/queue/{item_id}/suggest-llm")
def suggest_llm(item_id: str) -> dict[str, Any]:
    hits = store.query_docs(
        "SELECT * FROM c WHERE c.id = @id",
        [{"name": "@id", "value": item_id}],
    )
    if not hits:
        raise HTTPException(404, item_id)
    item = hits[0]
    mappings = _mappings()
    catalog = [
        f"{m['tagCanonical']}|{m['sap']['tag']}|{m['pi']['tag']}|{m['dwg']['tag']}|{m['description']}"
        for m in mappings
    ]
    from scripts.azure_text import cached_chat

    raw = cached_chat(
        "recon_suggest",
        "You map plant equipment tags across SAP, PI, and drawings. "
        "Return JSON only with keys suggestedCanonical, confidence (0-1), rationale. "
        "If unsure, suggestedCanonical null and confidence below 0.4. Never invent a tag.",
        json.dumps(
            {
                "unmatched": {
                    "sourceSystem": item.get("sourceSystem"),
                    "sourceTag": item.get("sourceTag"),
                    "ruleSuggestion": item.get("suggestedCanonical"),
                    "rule": item.get("rule"),
                    "reason": item.get("reason"),
                    "evidence": item.get("evidence"),
                },
                "catalog": catalog,
            },
            default=str,
        ),
        temperature=0.1,
    )
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        parsed = {"suggestedCanonical": None, "confidence": 0.0, "rationale": raw}
    item["llmSuggestion"] = parsed
    store.replace_doc(item)
    return {"item": item, "llm": parsed}
