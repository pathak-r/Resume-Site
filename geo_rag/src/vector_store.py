"""
Vector Store Management
Build and query FAISS index for document retrieval.
Uses hybrid retrieval: FAISS (semantic) + BM25 (keyword) fused via Reciprocal Rank Fusion.
"""
import os
import re
import json
import numpy as np
from typing import List, Dict, Optional, Tuple, Set
from src.config import FAISS_INDEX_PATH, TOP_K_RESULTS
from src.wells import canonicalize_well, metadata_well_matches, extract_well_from_text

# ── Module-level cache (populated on first query, reused for the process lifetime) ──
_cache: Optional[Dict] = None


def _load_cache() -> Dict:
    """Load FAISS index, texts, metadatas, and BM25 index once and cache them."""
    global _cache
    if _cache is not None:
        return _cache

    import faiss
    from rank_bm25 import BM25Okapi

    index_path = os.path.join(FAISS_INDEX_PATH, "index.faiss")
    data_path = os.path.join(FAISS_INDEX_PATH, "store_data.json")

    if not os.path.exists(index_path):
        raise FileNotFoundError(
            f"FAISS index not found at {index_path}. Run ingest.py first."
        )

    faiss_index = faiss.read_index(index_path)

    with open(data_path, "r") as f:
        store_data = json.load(f)

    texts: List[str] = store_data["texts"]
    metadatas: List[Dict] = store_data["metadatas"]

    tokenized = [_tokenize(t) for t in texts]
    bm25_index = BM25Okapi(tokenized)

    _cache = {
        "faiss_index": faiss_index,
        "texts": texts,
        "metadatas": metadatas,
        "bm25_index": bm25_index,
        "tokenized": tokenized,
    }
    print(f"[vector_store] Loaded {len(texts)} chunks into FAISS + BM25 hybrid index.")
    return _cache


def clear_cache() -> None:
    """Invalidate in-memory index cache (e.g. after repair)."""
    global _cache
    _cache = None


def _tokenize(text: str) -> List[str]:
    """
    Tokenize for BM25. Preserves well identifiers as single tokens
    (e.g. 15/9-f-14 → 15_9_f_14) so keyword search can hit well names.
    """
    text = text.lower()
    # Protect well-like tokens before stripping punctuation
    well_spans = []

    def _protect(m):
        well_spans.append(re.sub(r"[^\w]", "_", m.group(0)))
        return f" WELLTOKEN{len(well_spans) - 1} "

    text = re.sub(
        r"15\s*/?\s*9\s*-\s*f\s*-\s*\d+\s*[a-z]{0,2}",
        _protect,
        text,
        flags=re.I,
    )
    text = re.sub(r"\bf\s*-\s*\d+\s*[a-z]{0,2}\b", _protect, text, flags=re.I)
    text = re.sub(r"[^\w\s]", " ", text)
    tokens = text.split()
    out = []
    for t in tokens:
        m = re.fullmatch(r"welltoken(\d+)", t)
        if m:
            out.append(well_spans[int(m.group(1))])
        else:
            out.append(t)
    return out


def _reciprocal_rank_fusion(
    ranked_lists: List[List[int]], k: int = 60
) -> List[Tuple[int, float]]:
    """
    Merge multiple ranked lists of document indices using RRF.
    score(d) = sum( 1 / (k + rank_i(d)) ) for each list i that contains d.
    Returns list of (idx, rrf_score) sorted descending.
    """
    scores: Dict[int, float] = {}
    for ranked in ranked_lists:
        for rank, idx in enumerate(ranked):
            scores[idx] = scores.get(idx, 0.0) + 1.0 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)


def _allowed_indices(
    metadatas: List[Dict],
    well_name: Optional[str] = None,
    doc_type: Optional[str] = None,
) -> Optional[Set[int]]:
    """Return allowed chunk indices for metadata filters, or None if unfiltered."""
    if not well_name and not doc_type:
        return None

    allowed: Set[int] = set()
    for i, meta in enumerate(metadatas):
        if well_name and not metadata_well_matches(meta.get("well_name"), well_name):
            continue
        if doc_type:
            dt = (meta.get("doc_type") or "").lower()
            if doc_type.lower() not in dt and dt not in doc_type.lower():
                continue
        allowed.add(i)
    return allowed


def build_faiss_index(documents: List[Dict], embeddings_model) -> None:
    """
    Build FAISS index from processed documents.
    Saves index and metadata to disk.
    Call this from ingest.py — invalidates the in-memory cache afterwards.
    """
    global _cache
    import faiss

    texts = [doc["text"] for doc in documents]
    metadatas = [doc["metadata"] for doc in documents]

    print(f"Generating embeddings for {len(texts)} chunks...")
    vectors = embeddings_model.embed_documents(texts)
    vectors_np = np.array(vectors, dtype="float32")

    dimension = vectors_np.shape[1]
    index = faiss.IndexFlatIP(dimension)
    faiss.normalize_L2(vectors_np)
    index.add(vectors_np)

    os.makedirs(FAISS_INDEX_PATH, exist_ok=True)
    faiss.write_index(index, os.path.join(FAISS_INDEX_PATH, "index.faiss"))

    store_data = {"texts": texts, "metadatas": metadatas}
    with open(os.path.join(FAISS_INDEX_PATH, "store_data.json"), "w") as f:
        json.dump(store_data, f)

    _cache = None  # invalidate so next query rebuilds BM25 from fresh data
    print(f"FAISS index built with {index.ntotal} vectors (dim={dimension})")
    print(f"Saved to: {FAISS_INDEX_PATH}")


def load_faiss_index():
    """Legacy helper — kept for backward compatibility."""
    c = _load_cache()
    return c["faiss_index"], c["texts"], c["metadatas"]


def generate_query_variants(query: str, n_variants: int = 3) -> List[str]:
    """
    Use a fast LLM to generate alternative phrasings of the query.
    Returns the original query plus n_variants alternatives.
    Using different terminology helps catch chunks that BM25/FAISS would miss
    due to vocabulary mismatch between user language and document language.
    """
    import os
    from openai import OpenAI

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))
    prompt = (
        f"Generate {n_variants} alternative phrasings of the following question about "
        f"oil well operations and drilling data. Use different but equivalent terminology "
        f"(e.g. 'mud weight' ↔ 'drilling fluid density', 'water cut' ↔ 'water-oil ratio', "
        f"'completion' ↔ 'well construction'). Keep the same well name if present. "
        f"Output only the questions, one per line, no numbering.\n\n"
        f"Question: {query}"
    )
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=256,
        )
        lines = [l.strip() for l in resp.choices[0].message.content.strip().split("\n") if l.strip()]
        variants = lines[:n_variants]
    except Exception as e:
        print(f"[vector_store] Query variant generation failed ({e}); falling back to single query.")
        variants = []

    return [query] + variants


def search_documents_multi_query(
    query: str,
    embeddings_model,
    top_k: int = TOP_K_RESULTS,
    well_name: Optional[str] = None,
    doc_type: Optional[str] = None,
) -> List[Dict]:
    """
    Multi-query hybrid search.
    1. Generates alternative phrasings of the query via LLM.
    2. Runs hybrid BM25+FAISS search for each phrasing.
    3. Merges all ranked lists via Reciprocal Rank Fusion and deduplicates.
    """
    # Infer well from query when caller did not pass one
    if not well_name:
        well_name = extract_well_from_text(query)
    well_name = canonicalize_well(well_name) if well_name else None

    queries = generate_query_variants(query)
    fetch_k_per_query = max(top_k, 8)
    rrf_k = 60

    seen: Dict[str, Dict] = {}   # first-120-char key → result dict
    scores: Dict[str, float] = {}

    for q in queries:
        results = search_documents(
            q,
            embeddings_model,
            top_k=fetch_k_per_query,
            well_name=well_name,
            doc_type=doc_type,
        )
        for rank, r in enumerate(results):
            key = r["text"][:120]
            if key not in seen:
                seen[key] = r
            scores[key] = scores.get(key, 0.0) + 1.0 / (rrf_k + rank + 1)

    merged = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_k]

    results_out: List[Dict] = []
    for key, rrf_score in merged:
        entry = dict(seen[key])
        entry["score"] = rrf_score
        results_out.append(entry)

    return results_out


def search_documents(
    query: str,
    embeddings_model,
    top_k: int = TOP_K_RESULTS,
    well_name: Optional[str] = None,
    doc_type: Optional[str] = None,
) -> List[Dict]:
    """
    Hybrid search: FAISS (semantic) + BM25 (keyword) fused via Reciprocal Rank Fusion.
    Optional well_name / doc_type filters restrict the candidate pool before ranking.
    Returns list of {text, metadata, score} dicts, deduplicated and ranked.
    """
    import faiss

    cache = _load_cache()
    faiss_index: "faiss.Index" = cache["faiss_index"]
    texts: List[str] = cache["texts"]
    metadatas: List[Dict] = cache["metadatas"]
    bm25_index = cache["bm25_index"]

    allowed = _allowed_indices(metadatas, well_name=well_name, doc_type=doc_type)
    if allowed is not None and len(allowed) == 0:
        return []

    fetch_k = min(top_k * 2, len(texts))
    if allowed is not None:
        # Over-fetch then filter; also run a restricted FAISS pass if needed
        fetch_k = min(max(top_k * 20, 100), len(texts))

    # ── FAISS retrieval ──────────────────────────────────────────────────────────
    query_vector = np.array(
        embeddings_model.embed_query(query), dtype="float32"
    ).reshape(1, -1)
    faiss.normalize_L2(query_vector)
    _, faiss_indices = faiss_index.search(query_vector, fetch_k)
    faiss_ranked = [int(i) for i in faiss_indices[0] if i >= 0]
    if allowed is not None:
        faiss_ranked = [i for i in faiss_ranked if i in allowed]
        # If over-fetch still missed the well's chunks, score allowed vectors directly
        if len(faiss_ranked) < top_k and allowed:
            faiss_ranked = _faiss_rank_subset(
                faiss_index, query_vector, sorted(allowed), top_k=min(fetch_k, len(allowed))
            )

    # ── BM25 retrieval ───────────────────────────────────────────────────────────
    tokenized_query = _tokenize(query)
    bm25_scores = bm25_index.get_scores(tokenized_query)
    if allowed is not None:
        masked = np.full_like(bm25_scores, -np.inf)
        idx_list = list(allowed)
        masked[idx_list] = bm25_scores[idx_list]
        bm25_scores = masked
    bm25_ranked = np.argsort(bm25_scores)[::-1][:fetch_k].tolist()
    bm25_ranked = [i for i in bm25_ranked if np.isfinite(bm25_scores[i])]

    # ── Reciprocal Rank Fusion ───────────────────────────────────────────────────
    fused = _reciprocal_rank_fusion([faiss_ranked, bm25_ranked])[:top_k]

    results = []
    for idx, rrf_score in fused:
        results.append({
            "text": texts[idx],
            "metadata": metadatas[idx],
            "score": rrf_score,
        })

    return results


def _faiss_rank_subset(
    faiss_index, query_vector: np.ndarray, indices: List[int], top_k: int
) -> List[int]:
    """Rank a subset of vectors by inner product with the query (IndexFlatIP)."""
    if not indices:
        return []
    vecs = np.vstack([faiss_index.reconstruct(int(i)) for i in indices]).astype("float32")
    # query_vector already L2-normalized; reconstruct vectors are normalized on add
    scores = vecs @ query_vector.reshape(-1)
    order = np.argsort(scores)[::-1][:top_k]
    return [indices[int(j)] for j in order]
