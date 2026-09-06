"""Upsert tag-mapping docs into Cosmos DB (unit100 / tag_map)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from apps.api.recon import build_recon_docs, summary  # noqa: E402
from apps.api.store import upsert_docs  # noqa: E402


def main() -> int:
    docs = build_recon_docs()
    n = upsert_docs(docs)
    stats = summary(docs)
    print(json.dumps({"upserted": n, **stats}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
