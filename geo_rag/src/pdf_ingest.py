"""
PDF Ingestion Pipeline
Parses well reports and drilling reports using LlamaParse + SemanticChunker.

Each PDF is parsed in an isolated subprocess so a crash on one file does not
abort the full ingest run.  Files > LARGE_FILE_THRESHOLD are split into
individual pages first (using pypdf) to stay within memory limits.
A disk cache stores parsed text so interrupted runs can resume without
re-hitting the LlamaParse API.
"""
import os
import re
import json
import tempfile
import subprocess
import sys
from typing import List, Dict
from langchain_experimental.text_splitter import SemanticChunker
from src.config import PDF_DIR, LLAMA_CLOUD_API_KEY
from src.llm import get_embeddings

PARSE_TIMEOUT = 180
LARGE_FILE_THRESHOLD = 500 * 1024   # 500 KB — split into pages above this
CACHE_DIR_NAME = ".parse_cache"


def _cache_dir(pdf_dir: str) -> str:
    return os.path.join(pdf_dir, CACHE_DIR_NAME)


def _cache_path(pdf_dir: str, filename: str) -> str:
    return os.path.join(_cache_dir(pdf_dir), filename + ".json")


def _load_cache(pdf_dir: str, filename: str):
    path = _cache_path(pdf_dir, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None


def _save_cache(pdf_dir: str, filename: str, text: str) -> None:
    cache_dir = _cache_dir(pdf_dir)
    os.makedirs(cache_dir, exist_ok=True)
    with open(_cache_path(pdf_dir, filename), "w", encoding="utf-8") as f:
        json.dump(text, f)


_WORKER_SCRIPT = """
import sys, os, json, warnings
warnings.filterwarnings("ignore")
pdf_path = sys.argv[1]
out_path  = sys.argv[2]

from llama_parse import LlamaParse
parser = LlamaParse(
    api_key=os.environ["LLAMA_CLOUD_API_KEY"],
    result_type="markdown",
    verbose=False,
)
docs = parser.load_data(pdf_path)
text = "\\n\\n".join(d.text for d in docs)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(text, f)
"""


def _parse_single_file(pdf_path: str) -> str:
    """
    Call LlamaParse in an isolated subprocess.
    Returns the parsed markdown text.
    """
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as sf:
        sf.write(_WORKER_SCRIPT)
        script_path = sf.name

    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as of:
        out_path = of.name

    try:
        env = {**os.environ, "LLAMA_CLOUD_API_KEY": LLAMA_CLOUD_API_KEY}
        result = subprocess.run(
            [sys.executable, script_path, pdf_path, out_path],
            timeout=PARSE_TIMEOUT,
            env=env,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            raise RuntimeError(
                f"LlamaParse worker exited {result.returncode}: "
                f"{(result.stderr or result.stdout)[-400:]}"
            )
        with open(out_path, "r", encoding="utf-8") as f:
            return json.load(f)
    finally:
        for p in (script_path, out_path):
            try:
                os.unlink(p)
            except OSError:
                pass


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract structured markdown text from a PDF via LlamaParse.
    Large files are split page-by-page to stay within memory limits.
    """
    file_size = os.path.getsize(pdf_path)

    if file_size > LARGE_FILE_THRESHOLD:
        # Split into individual page PDFs, parse each, then concatenate
        try:
            from pypdf import PdfReader, PdfWriter
        except ImportError:
            from PyPDF2 import PdfReader, PdfWriter  # older name fallback

        reader = PdfReader(pdf_path)
        num_pages = len(reader.pages)
        page_texts = []

        with tempfile.TemporaryDirectory() as tmp_dir:
            for page_num in range(num_pages):
                page_pdf = os.path.join(tmp_dir, f"page_{page_num:04d}.pdf")
                writer = PdfWriter()
                writer.add_page(reader.pages[page_num])
                with open(page_pdf, "wb") as out_f:
                    writer.write(out_f)
                try:
                    page_text = _parse_single_file(page_pdf)
                    page_texts.append(page_text)
                except Exception as page_err:
                    print(f"      page {page_num + 1}/{num_pages} failed: {page_err}")

        return "\n\n".join(page_texts)
    else:
        return _parse_single_file(pdf_path)


def extract_metadata_from_filename(filename: str) -> Dict:
    """
    Extract well name and document type from PDF filename.
    Examples:
        15_9_F_11_2013_03_08.pdf -> well=15/9-F-11, date=2013-03-08
        F12_COMPLETION_REPORT_1.PDF -> well=F-12, type=completion_report
    """
    metadata = {"source_file": filename}
    name = filename.replace(".pdf", "").replace(".PDF", "")

    daily_match = re.match(
        r"15_9_F[_-]?(\d+)_(\d{4})_(\d{2})_(\d{2})", name
    )
    if daily_match:
        well_num = daily_match.group(1)
        year, month, day = daily_match.groups()[1:]
        metadata["well_name"] = f"15/9-F-{well_num}"
        metadata["date"] = f"{year}-{month}-{day}"
        metadata["doc_type"] = "daily_drilling_report"
        return metadata

    expl_match = re.match(
        r"15_9_19_([A-Z])_(\d{4})_(\d{2})_(\d{2})", name
    )
    if expl_match:
        sidetrack = expl_match.group(1)
        year, month, day = expl_match.groups()[1:]
        metadata["well_name"] = f"15/9-19{sidetrack}"
        metadata["date"] = f"{year}-{month}-{day}"
        metadata["doc_type"] = "daily_drilling_report"
        return metadata

    comp_match = re.match(r"F(\d+)_COMPLETION", name, re.IGNORECASE)
    if comp_match:
        well_num = comp_match.group(1)
        metadata["well_name"] = f"15/9-F-{well_num}"
        metadata["doc_type"] = "completion_report"
        return metadata

    fwr_match = re.match(r"FWR_Completion_F(\d+)", name, re.IGNORECASE)
    if fwr_match:
        well_num = fwr_match.group(1)
        metadata["well_name"] = f"15/9-F-{well_num}"
        metadata["doc_type"] = "final_well_report"
        return metadata

    fc_match = re.match(r"15-9-F-(\d+)-([A-Z]+)", name, re.IGNORECASE)
    if fc_match:
        well_num = fc_match.group(1)
        sidetrack = fc_match.group(2)
        metadata["well_name"] = f"15/9-F-{well_num} {sidetrack}"
        metadata["doc_type"] = "completion_report"
        return metadata

    metadata["well_name"] = "Unknown"
    metadata["doc_type"] = "unknown"
    return metadata


def process_all_pdfs(pdf_dir: str = None) -> List[Dict]:
    """
    Process all PDFs in the directory.
    Returns list of {text, metadata} dicts ready for embedding.
    Uses a disk cache so interrupted runs resume without re-calling the API.
    """
    pdf_dir = pdf_dir or PDF_DIR
    documents = []

    if not os.path.exists(pdf_dir):
        print(f"PDF directory not found: {pdf_dir}")
        return documents

    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")]
    print(f"Found {len(pdf_files)} PDF files to process")

    embeddings = get_embeddings()
    chunker = SemanticChunker(embeddings)

    for filename in sorted(pdf_files):
        filepath = os.path.join(pdf_dir, filename)
        size_kb = os.path.getsize(filepath) // 1024

        cached = _load_cache(pdf_dir, filename)
        if cached is not None:
            print(f"  Cached:     {filename} ({size_kb} KB)")
            text = cached
        else:
            print(f"  Processing: {filename} ({size_kb} KB)")
            try:
                text = extract_text_from_pdf(filepath)
                _save_cache(pdf_dir, filename, text)
            except subprocess.TimeoutExpired:
                print(f"    Skipped (timeout after {PARSE_TIMEOUT}s): {filename}")
                continue
            except Exception as e:
                print(f"    Error: {e}")
                continue

        if not text.strip():
            print(f"    Warning: no text extracted")
            continue

        metadata = extract_metadata_from_filename(filename)
        chunks = chunker.split_text(text)
        print(f"    -> {len(chunks)} chunks")

        for i, chunk in enumerate(chunks):
            documents.append({
                "text": chunk,
                "metadata": {
                    **metadata,
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                },
            })

    print(f"\nTotal documents for embedding: {len(documents)}")
    return documents
