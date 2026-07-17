"""
PDF Ingestion Pipeline
Parses well reports and drilling reports using LlamaParse + SemanticChunker.
"""
import os
import re
from typing import List, Dict, Any
from src.config import PDF_DIR, LLAMA_CLOUD_API_KEY, MAX_CHUNK_SIZE, MIN_CHUNK_CHARS


def extract_text_from_pdf(pdf_path: str, parser: Any) -> str:
    """Extract structured markdown text from a PDF file using LlamaParse."""
    documents = parser.load_data(pdf_path)
    return "\n\n".join(doc.text for doc in documents)


def extract_metadata_from_filename(filename: str) -> Dict:
    """
    Extract well name and date from PDF filename.
    Examples:
        15_9_F_11_2013_03_08.pdf -> well=15/9-F-11, date=2013-03-08
        15_9_F_1_C_2014_03_02.pdf -> well=15/9-F-1 C, date=2014-03-02
        15_9_19_A_1997_07_30.pdf -> well=15/9-19A, date=1997-07-30
        F12_COMPLETION_REPORT_1.PDF -> well=15/9-F-12, type=completion_report
    """
    metadata = {"source_file": filename}

    name = filename.replace(".pdf", "").replace(".PDF", "")

    # Sidetrack daily: 15_9_F_1_C_2014_03_02 (letter before year)
    daily_st_match = re.match(
        r"15_9_F[_-]?(\d+)_([A-Za-z]+)_(\d{4})_(\d{2})_(\d{2})", name
    )
    if daily_st_match:
        well_num = daily_st_match.group(1)
        sidetrack = daily_st_match.group(2).upper()
        year, month, day = daily_st_match.group(3, 4, 5)
        metadata["well_name"] = f"15/9-F-{well_num} {sidetrack}"
        metadata["date"] = f"{year}-{month}-{day}"
        metadata["doc_type"] = "daily_drilling_report"
        return metadata

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

    # 15-9-F-1-C-COMPLETION_REPORT_1
    fc_match = re.match(r"15-9-F-(\d+)-([A-Z]+)", name, re.IGNORECASE)
    if fc_match:
        well_num = fc_match.group(1)
        sidetrack = fc_match.group(2).upper()
        metadata["well_name"] = f"15/9-F-{well_num} {sidetrack}"
        metadata["doc_type"] = "completion_report"
        return metadata

    metadata["well_name"] = "Unknown"
    metadata["doc_type"] = "unknown"
    return metadata


_JUNK_ONLY = re.compile(
    r"^(?:\|[\s\-:]*|\|?\s*(?:description|synergi\s*no|p\.?)\s*\|?|no\.?\s*(?:0|xxx)?|"
    r"ref\.?|statoil(?:\s+#?\s*final\s+well\s+report)?|"
    r"\|?\s*-{3,}\s*\|?)$",
    re.I,
)


def is_junk_chunk(text: str, min_chars: int = None) -> bool:
    """Drop empty, tiny, or header/separator-only chunks before embedding."""
    min_chars = MIN_CHUNK_CHARS if min_chars is None else min_chars
    if not text or not text.strip():
        return True
    cleaned = text.strip()
    if len(cleaned) < min_chars:
        return True
    # Separator / column-header fragments
    if _JUNK_ONLY.match(cleaned):
        return True
    # Mostly pipes / dashes with almost no words
    word_chars = re.sub(r"[^\w]", "", cleaned)
    if len(word_chars) < 20 and cleaned.count("|") >= 1:
        return True
    return False


def process_all_pdfs(pdf_dir: str = None) -> List[Dict]:
    """
    Process all PDFs in the directory.
    Returns list of {text, metadata} dicts ready for embedding.
    """
    from llama_parse import LlamaParse
    from langchain_experimental.text_splitter import SemanticChunker
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from src.llm import get_embeddings

    pdf_dir = pdf_dir or PDF_DIR
    documents = []

    if not os.path.exists(pdf_dir):
        print(f"PDF directory not found: {pdf_dir}")
        return documents

    pdf_files = [f for f in os.listdir(pdf_dir)
                 if f.lower().endswith(".pdf")]

    print(f"Found {len(pdf_files)} PDF files to process")

    parser = LlamaParse(
        api_key=LLAMA_CLOUD_API_KEY,
        result_type="markdown",
        verbose=False,
    )
    embeddings = get_embeddings()
    chunker = SemanticChunker(embeddings)

    # Secondary splitter enforces a hard character ceiling on oversized chunks.
    # Separators include "|" so Markdown table rows split cleanly.
    secondary_splitter = RecursiveCharacterTextSplitter(
        chunk_size=MAX_CHUNK_SIZE,
        chunk_overlap=150,
        separators=["\n\n", "\n", "|", " ", ""],
    )

    dropped_junk = 0

    for filename in sorted(pdf_files):
        filepath = os.path.join(pdf_dir, filename)
        print(f"  Processing: {filename}")

        try:
            text = extract_text_from_pdf(filepath, parser)
            metadata = extract_metadata_from_filename(filename)

            if not text.strip():
                print(f"    Warning: No text extracted from {filename}")
                continue

            # Pass 1: semantic boundaries
            semantic_chunks = chunker.split_text(text)

            # Pass 2: enforce hard size ceiling
            chunks = []
            for sc in semantic_chunks:
                if len(sc) > MAX_CHUNK_SIZE:
                    chunks.extend(secondary_splitter.split_text(sc))
                else:
                    chunks.append(sc)

            # Pass 3: drop junk
            kept = []
            for sc in chunks:
                if is_junk_chunk(sc):
                    dropped_junk += 1
                else:
                    kept.append(sc)
            chunks = kept

            oversized = sum(1 for sc in semantic_chunks if len(sc) > MAX_CHUNK_SIZE)
            print(f"    {len(semantic_chunks)} semantic chunks → {len(chunks)} final chunks "
                  f"({oversized} re-split for exceeding {MAX_CHUNK_SIZE} chars)")

            for i, chunk in enumerate(chunks):
                doc = {
                    "text": chunk,
                    "metadata": {
                        **metadata,
                        "chunk_index": i,
                        "total_chunks": len(chunks),
                    }
                }
                documents.append(doc)

        except Exception as e:
            print(f"    Error processing {filename}: {e}")

    print(f"\nDropped {dropped_junk} junk chunks")
    print(f"Total documents for embedding: {len(documents)}")
    return documents
