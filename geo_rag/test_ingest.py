"""
Quick pipeline validation: parse 5 small PDFs and build a test FAISS index.
Run from geo_rag/ directory.  Not for production use — use ingest.py for that.
"""
import os
import sys
import glob

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.pdf_ingest import extract_text_from_pdf, extract_metadata_from_filename, \
    SemanticChunker
from src.llm import get_embeddings
from src.vector_store import build_faiss_index
from src.config import PDF_DIR

def main():
    print("=== Pipeline validation (5 small PDFs) ===")

    all_pdfs = sorted(glob.glob(os.path.join(PDF_DIR, "*.pdf")))
    by_size = sorted(all_pdfs, key=os.path.getsize)
    test_pdfs = by_size[:5]

    print(f"Test files: {[os.path.basename(p) for p in test_pdfs]}")

    embeddings = get_embeddings()
    chunker = SemanticChunker(embeddings)
    documents = []

    for filepath in test_pdfs:
        filename = os.path.basename(filepath)
        kb = os.path.getsize(filepath) // 1024
        print(f"\n  {filename} ({kb} KB)")
        try:
            text = extract_text_from_pdf(filepath)
            if not text.strip():
                print("    WARNING: empty text")
                continue
            metadata = extract_metadata_from_filename(filename)
            chunks = chunker.split_text(text)
            print(f"    -> {len(chunks)} chunks, first chunk preview: {chunks[0][:80]!r}")
            for i, chunk in enumerate(chunks):
                documents.append({"text": chunk, "metadata": {**metadata, "chunk_index": i}})
        except Exception as e:
            print(f"    ERROR: {e}")

    print(f"\nTotal chunks: {len(documents)}")
    if documents:
        import tempfile, os as _os
        test_index_path = tempfile.mkdtemp(prefix="faiss_test_")
        orig = __import__('src.config', fromlist=['FAISS_INDEX_PATH'])
        orig.FAISS_INDEX_PATH = test_index_path

        from src import config
        config.FAISS_INDEX_PATH = test_index_path

        from src.vector_store import build_faiss_index as bfi
        import src.vector_store as vs
        vs_orig = vs.FAISS_INDEX_PATH if hasattr(vs, 'FAISS_INDEX_PATH') else None

        import importlib
        import src.vector_store
        src.vector_store.FAISS_INDEX_PATH = test_index_path
        src.vector_store.build_faiss_index(documents, embeddings)
        print(f"\n  FAISS index written to {test_index_path}")
        print("\n=== VALIDATION PASSED ===")
    else:
        print("\n=== VALIDATION FAILED: no documents ===")
        sys.exit(1)

if __name__ == "__main__":
    main()
