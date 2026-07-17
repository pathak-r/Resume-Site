"""
Canonical Volve well identifiers and matching helpers.

Production data uses names like "15/9-F-11 H"; PDF metadata often omits the
sidetrack letter ("15/9-F-11"). Agents and users mix short forms ("F-11", "F-1").
"""
from __future__ import annotations

import re
from typing import Dict, Iterable, List, Optional, Set

# Display / production names (after stripping "NO ")
CANONICAL_WELLS = [
    "15/9-F-1 C",
    "15/9-F-4 AH",
    "15/9-F-5 AH",
    "15/9-F-11 H",
    "15/9-F-12 H",
    "15/9-F-14 H",
    "15/9-F-15 D",
]

# PDF metadata well_name → canonical production name
PDF_TO_CANONICAL: Dict[str, str] = {
    "15/9-F-1 C": "15/9-F-1 C",
    "15/9-F-1": "15/9-F-1 C",
    "15/9-F-4": "15/9-F-4 AH",
    "15/9-F-4 AH": "15/9-F-4 AH",
    "15/9-F-5": "15/9-F-5 AH",
    "15/9-F-5 AH": "15/9-F-5 AH",
    "15/9-F-11": "15/9-F-11 H",
    "15/9-F-11 H": "15/9-F-11 H",
    "15/9-F-12": "15/9-F-12 H",
    "15/9-F-12 H": "15/9-F-12 H",
    "15/9-F-14": "15/9-F-14 H",
    "15/9-F-14 H": "15/9-F-14 H",
    "15/9-F-15": "15/9-F-15 D",
    "15/9-F-15 D": "15/9-F-15 D",
}


def _norm(s: str) -> str:
    """Lowercase and collapse separators for comparison."""
    s = s.lower().strip()
    s = s.replace("no ", "")
    s = re.sub(r"[\s_/]+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s


def canonicalize_well(name: Optional[str]) -> Optional[str]:
    """
    Map a user/PDF/production well string to a canonical production name.
    Returns None if the input cannot be resolved to a known Volve well.
    """
    if not name or not str(name).strip():
        return None

    raw = str(name).strip()
    if raw.lower() in ("unknown", "all", "none"):
        return None

    # Direct PDF / canonical hits
    if raw in PDF_TO_CANONICAL:
        return PDF_TO_CANONICAL[raw]

    n = _norm(raw)

    # Exact canonical / pdf normalized
    for canon in CANONICAL_WELLS:
        if _norm(canon) == n:
            return canon
    for pdf_name, canon in PDF_TO_CANONICAL.items():
        if _norm(pdf_name) == n:
            return canon

    # Patterns: 15/9-F-11 H, 15-9-F-11H, F-11, F11, F-1 C, F1C
    m = re.search(
        r"(?:15/?9-?)?f-?(\d+)\s*([a-z]{0,2})\b",
        n,
        re.I,
    )
    if not m:
        return None

    num = m.group(1)
    suffix = (m.group(2) or "").upper()

    # Ambiguous short token "F-1" / "F1" → F-1 C (not F-11/F-12/F-14/F-15)
    candidates = [c for c in CANONICAL_WELLS if re.search(rf"F-{num}\b", c)]
    if not candidates:
        return None

    if suffix:
        for c in candidates:
            # Match trailing sidetrack letters (H, AH, D, C)
            c_suf = re.search(r"F-\d+\s*([A-Z]+)$", c)
            if c_suf and c_suf.group(1).startswith(suffix):
                return c
        # suffix given but no match — still prefer exact well number family
        if len(candidates) == 1:
            return candidates[0]
        return None

    if len(candidates) == 1:
        return candidates[0]

    # Prefer the primary producer naming when multiple share a number family
    # (should not happen for Volve numbering)
    return candidates[0]


def well_aliases(canonical: str) -> Set[str]:
    """All known string forms that refer to this well (for metadata filtering)."""
    aliases = {canonical, canonical.replace(" ", "")}
    for pdf_name, canon in PDF_TO_CANONICAL.items():
        if canon == canonical:
            aliases.add(pdf_name)
            aliases.add(pdf_name.replace(" ", ""))
    # Short forms
    m = re.search(r"F-(\d+)\s*([A-Z]*)$", canonical)
    if m:
        num, suf = m.group(1), m.group(2)
        aliases.add(f"F-{num}")
        aliases.add(f"F{num}")
        if suf:
            aliases.add(f"F-{num} {suf}")
            aliases.add(f"F-{num}{suf}")
            aliases.add(f"F{num}{suf}")
    return aliases


def metadata_well_matches(meta_well: Optional[str], query_well: Optional[str]) -> bool:
    """True if document metadata well_name refers to the same well as query_well."""
    if not query_well:
        return True
    canon_q = canonicalize_well(query_well)
    if not canon_q:
        return False
    if not meta_well or meta_well == "Unknown":
        return False
    canon_m = canonicalize_well(meta_well)
    if canon_m:
        return canon_m == canon_q
    # Fallback: normalized equality / alias set
    aliases = {_norm(a) for a in well_aliases(canon_q)}
    return _norm(meta_well) in aliases


def resolve_production_mask(well_names: Iterable[str], query: str) -> Optional[str]:
    """
    Resolve query to the exact WELL_NAME value present in the dataframe, if any.
    Prefer exact canonical match over substring matching.
    """
    canon = canonicalize_well(query)
    names = list(well_names)
    if not names:
        return None

    if canon:
        # Exact match on production name
        for n in names:
            if n == canon or canonicalize_well(n) == canon:
                return n
        # Case-insensitive exact
        for n in names:
            if n.lower() == canon.lower():
                return n

    # Last resort: unique substring match only when unambiguous
    q = query.strip()
    hits = [n for n in names if q.lower() in n.lower()]
    if len(hits) == 1:
        return hits[0]

    # If multiple hits but canonicalize collapses to one, use that
    if hits:
        canons = {canonicalize_well(h) for h in hits}
        canons.discard(None)
        if len(canons) == 1:
            target = canons.pop()
            for n in hits:
                if canonicalize_well(n) == target:
                    return n

    return None


def extract_well_from_text(text: str) -> Optional[str]:
    """Best-effort well extraction from a free-text query."""
    if not text:
        return None
    # Prefer longer / more specific matches first
    patterns = [
        r"15\s*/\s*9\s*-\s*F\s*-\s*\d+\s*[A-Za-z]{0,2}",
        r"\bF\s*-\s*\d+\s*[A-Za-z]{0,2}\b",
        r"\bF\s*\d+\s*[A-Za-z]{0,2}\b",
    ]
    for pat in patterns:
        matches = re.findall(pat, text, flags=re.I)
        # Prefer matches with sidetrack letters / more specificity
        ranked = sorted(matches, key=lambda m: (len(m), m), reverse=True)
        for m in ranked:
            canon = canonicalize_well(m)
            if canon:
                return canon
    return None


def pdf_well_names_for(canonical: str) -> List[str]:
    """PDF metadata well_name values that map to this canonical well."""
    return sorted({pdf for pdf, c in PDF_TO_CANONICAL.items() if c == canonical})
