"""SQLite document store for tag mappings and work packages. Never logs secrets."""

from __future__ import annotations

import json
import os
import re
import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

from dotenv import load_dotenv

from scripts.common import DATA_DIR, ENV_PATH

CONTAINER = "tag_map"
PACKAGES = "packages"

_LOCK = threading.Lock()
_READY_FOR: str | None = None
_WHERE = re.compile(r"\s+WHERE\s+", re.IGNORECASE)
_AND = re.compile(r"\s+AND\s+", re.IGNORECASE)
_CLAUSE = re.compile(r"c\.(\w+)\s*=\s*(@\w+|'[^']*')\s*$")


def _load_env() -> None:
    load_dotenv(ENV_PATH)


def db_path() -> Path:
    """Persisted file. SQLITE_PATH wins; otherwise a Railway volume mount, then data/unit100.db."""
    _load_env()
    raw = os.environ.get("SQLITE_PATH", "").strip()
    if raw:
        return Path(raw)
    mount = os.environ.get("RAILWAY_VOLUME_MOUNT_PATH", "").strip()
    if mount:
        return Path(mount) / "unit100.db"
    return DATA_DIR / "unit100.db"


def _connect() -> sqlite3.Connection:
    path = db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS docs (
            container TEXT NOT NULL,
            id TEXT NOT NULL,
            body TEXT NOT NULL,
            PRIMARY KEY (container, id)
        )
        """
    )
    conn.commit()
    return conn


@contextmanager
def _session() -> Iterator[sqlite3.Connection]:
    conn = _connect()
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def _read_container(container: str) -> list[dict[str, Any]]:
    with _session() as conn:
        rows = conn.execute("SELECT body FROM docs WHERE container = ?", (container,)).fetchall()
    return [json.loads(row["body"]) for row in rows]


def _count(container: str) -> int:
    with _session() as conn:
        row = conn.execute("SELECT COUNT(*) AS n FROM docs WHERE container = ?", (container,)).fetchone()
    return int(row["n"])


def _write_docs(container: str, docs: list[dict[str, Any]]) -> int:
    with _session() as conn:
        conn.executemany(
            """
            INSERT INTO docs (container, id, body) VALUES (?, ?, ?)
            ON CONFLICT(container, id) DO UPDATE SET body = excluded.body
            """,
            [(container, str(doc["id"]), json.dumps(doc, default=str)) for doc in docs],
        )
    return len(docs)


def _delete_ids(container: str, ids: list[str]) -> int:
    if not ids:
        return 0
    with _session() as conn:
        conn.executemany("DELETE FROM docs WHERE container = ? AND id = ?", [(container, item_id) for item_id in ids])
    return len(ids)


def ensure_ready() -> None:
    """Create the database and seed tag mappings from the shipped CSVs when empty."""
    global _READY_FOR
    path = str(db_path())
    with _LOCK:
        with _session():
            pass
        if _READY_FOR == path:
            return
        autoseed = os.environ.get("UNIT100_AUTOSEED", "1") != "0"
        if autoseed and _count(CONTAINER) == 0 and _can_rebuild_recon():
            from apps.api.recon import build_recon_docs

            _write_docs(CONTAINER, build_recon_docs())
        _READY_FOR = path


def upsert_docs(docs: list[dict[str, Any]]) -> int:
    ensure_ready()
    return _write_docs(CONTAINER, docs)


def _matches(doc: dict[str, Any], sql: str, params: list[dict] | None) -> bool:
    parts = _WHERE.split(sql, maxsplit=1)
    if len(parts) == 1:
        return True
    values = {item["name"]: item["value"] for item in (params or [])}
    for clause in _AND.split(parts[1]):
        match = _CLAUSE.match(clause.strip())
        if not match:
            raise ValueError(f"Unsupported query: {sql}")
        field, raw = match.group(1), match.group(2)
        expected = values[raw] if raw.startswith("@") else raw[1:-1]
        if doc.get(field) != expected:
            return False
    return True


def query_docs(sql: str, params: list[dict] | None = None) -> list[dict[str, Any]]:
    ensure_ready()
    return [doc for doc in _read_container(CONTAINER) if _matches(doc, sql, params)]


def get_doc(item_id: str, pk: str) -> dict[str, Any] | None:
    ensure_ready()
    for doc in _read_container(CONTAINER):
        if doc.get("id") == item_id and doc.get("tagCanonical") == pk:
            return doc
    return None


def replace_doc(doc: dict[str, Any]) -> dict[str, Any]:
    ensure_ready()
    _write_docs(CONTAINER, [doc])
    return doc


def package_id(ta_id: str, canonical: str) -> str:
    return f"{ta_id}-{canonical}"


def get_package(canonical: str, ta_id: str = "TA-2027") -> dict[str, Any] | None:
    ensure_ready()
    wanted = package_id(ta_id, canonical)
    for doc in _read_container(PACKAGES):
        if doc.get("id") == wanted:
            return doc
    return None


def upsert_package(doc: dict[str, Any]) -> dict[str, Any]:
    ensure_ready()
    _write_docs(PACKAGES, [doc])
    return doc


def list_packages(ta_id: str = "TA-2027") -> list[dict[str, Any]]:
    ensure_ready()
    return [doc for doc in _read_container(PACKAGES) if doc.get("taId") == ta_id]


def delete_packages(ta_id: str = "TA-2027") -> int:
    ids = [doc["id"] for doc in list_packages(ta_id)]
    return _delete_ids(PACKAGES, ids)


def delete_tag_map() -> int:
    ids = [doc["id"] for doc in query_docs("SELECT * FROM c") if doc.get("tagCanonical")]
    return _delete_ids(CONTAINER, ids)


def reset_mapping_doc(doc: dict[str, Any]) -> dict[str, Any]:
    variants = [doc.get("sap") or {}, doc.get("pi") or {}, doc.get("dwg") or {}]
    doc["aliases"] = []
    doc["reviewedBy"] = None
    doc["reviewedAt"] = None
    doc["reviewNote"] = None
    doc["overallStatus"] = "mapped" if all(v.get("status") == "mapped" for v in variants) else "review"
    confs = [float(v.get("confidence") or 0) for v in variants]
    doc["overallConfidence"] = round(min(confs) if confs else 0.0, 2)
    doc["flags"] = [v["rule"] for v in variants if v.get("rule") and v["rule"] != "exact_formula"]
    return doc


def reset_unmatched_doc(doc: dict[str, Any]) -> dict[str, Any]:
    doc["status"] = "open"
    doc["reviewedBy"] = None
    doc["reviewedAt"] = None
    doc["reviewNote"] = None
    doc.pop("llmSuggestion", None)
    return doc


def reset_tag_map_in_place() -> int:
    reset = 0
    for doc in query_docs("SELECT * FROM c"):
        kind = doc.get("docType")
        if kind == "mapping":
            reset_mapping_doc(doc)
        elif kind == "unmatched":
            reset_unmatched_doc(doc)
        else:
            continue
        replace_doc(doc)
        reset += 1
    return reset


def _can_rebuild_recon() -> bool:
    from apps.api.recon import DATA

    return (DATA / "sensor_daily.parquet").exists() or (DATA / "sensor_daily.csv").exists()


def reset_demo(ta_id: str = "TA-2027") -> dict[str, Any]:
    from apps.api.recon import build_recon_docs, summary

    packages_removed = delete_packages(ta_id)
    if _can_rebuild_recon():
        docs = build_recon_docs()
        mappings_removed = delete_tag_map()
        restored = upsert_docs(docs)
        stats = summary(docs)
        mode = "rebuild"
    else:
        mappings_removed = 0
        restored = reset_tag_map_in_place()
        stats = summary(query_docs("SELECT * FROM c"))
        mode = "inplace"
    return {
        "ok": True,
        "mode": mode,
        "packagesRemoved": packages_removed,
        "mappingsRemoved": mappings_removed,
        "mappingsRestored": restored,
        **stats,
    }
