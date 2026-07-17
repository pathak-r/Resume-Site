"""
Repair existing FAISS index without re-parsing PDFs.

- Re-derives well_name / doc_type / date from source_file (fixes F-1 C Unknown)
- Drops junk / tiny chunks
- Rebuilds FAISS by reconstructing kept vectors (no re-embedding / no LlamaParse)

Usage (from geo_rag/):
    python repair_index.py
"""
import json
import os
import shutil
from datetime import datetime, timezone

import numpy as np

from src.config import FAISS_INDEX_PATH, MIN_CHUNK_CHARS
from src.pdf_ingest import extract_metadata_from_filename, is_junk_chunk
from src.vector_store import clear_cache


def main():
    import faiss

    index_path = os.path.join(FAISS_INDEX_PATH, "index.faiss")
    data_path = os.path.join(FAISS_INDEX_PATH, "store_data.json")

    if not os.path.exists(index_path) or not os.path.exists(data_path):
        raise SystemExit(f"Index not found under {FAISS_INDEX_PATH}. Run ingest.py first.")

    print("=" * 60)
    print("Geo-Agentic RAG — Index repair (no re-parse)")
    print("=" * 60)

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_dir = os.path.join(FAISS_INDEX_PATH, f"backup_{stamp}")
    os.makedirs(backup_dir, exist_ok=True)
    shutil.copy2(index_path, os.path.join(backup_dir, "index.faiss"))
    shutil.copy2(data_path, os.path.join(backup_dir, "store_data.json"))
    print(f"Backup written to {backup_dir}")

    faiss_index = faiss.read_index(index_path)
    with open(data_path, "r") as f:
        store = json.load(f)

    texts = store["texts"]
    metadatas = store["metadatas"]
    n = len(texts)
    if faiss_index.ntotal != n:
        raise SystemExit(
            f"Index size mismatch: faiss={faiss_index.ntotal} store={n}"
        )

    print(f"Loaded {n} chunks")

    keep_idx = []
    new_texts = []
    new_metas = []
    meta_fixed = 0
    junk_dropped = 0

    for i, (text, meta) in enumerate(zip(texts, metadatas)):
        if is_junk_chunk(text, min_chars=MIN_CHUNK_CHARS):
            junk_dropped += 1
            continue

        source = meta.get("source_file") or ""
        refreshed = extract_metadata_from_filename(source) if source else {}
        merged = {**meta, **{k: v for k, v in refreshed.items() if k != "source_file"}}
        if source:
            merged["source_file"] = source

        if (
            meta.get("well_name") != merged.get("well_name")
            or meta.get("doc_type") != merged.get("doc_type")
        ):
            meta_fixed += 1

        keep_idx.append(i)
        new_texts.append(text)
        new_metas.append(merged)

    print(f"Dropped junk chunks: {junk_dropped}")
    print(f"Metadata records updated: {meta_fixed}")
    print(f"Keeping {len(keep_idx)} / {n} chunks")

    # Recount Unknown after fix
    unknown = sum(1 for m in new_metas if m.get("well_name") == "Unknown")
    print(f"Remaining Unknown well_name chunks: {unknown}")

    print("Reconstructing FAISS vectors for kept chunks...")
    vectors = np.vstack(
        [faiss_index.reconstruct(int(i)) for i in keep_idx]
    ).astype("float32")

    dim = vectors.shape[1]
    new_index = faiss.IndexFlatIP(dim)
    # Vectors were L2-normalized at ingest time; keep as-is
    new_index.add(vectors)

    # Re-number chunk_index within each source file
    totals = {}
    for meta in new_metas:
        sf = meta.get("source_file")
        totals[sf] = totals.get(sf, 0) + 1
    counters = {}
    for meta in new_metas:
        sf = meta.get("source_file")
        counters[sf] = counters.get(sf, 0)
        meta["chunk_index"] = counters[sf]
        meta["total_chunks"] = totals[sf]
        counters[sf] += 1

    faiss.write_index(new_index, index_path)
    with open(data_path, "w") as f:
        json.dump({"texts": new_texts, "metadatas": new_metas}, f)

    clear_cache()
    print(f"Wrote repaired index: {new_index.ntotal} vectors (dim={dim})")
    print("Done.")


if __name__ == "__main__":
    main()
