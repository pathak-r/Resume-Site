"""Shared paths, seed, and helpers for the Unit 100 generators."""

from __future__ import annotations

from pathlib import Path

SEED = 42
UNIT = 100
PLANT = "Al Marsa Refinery"
TODAY = "2026-09-02"

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
CACHE_DIR = DATA_DIR / ".cache"
README_PATH = DATA_DIR / "README.md"
ENV_PATH = ROOT / ".env"


def ensure_dirs() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)


def append_readme(section: str) -> None:
    """Append a markdown section if its first heading is not already present."""
    heading = next((ln.strip() for ln in section.splitlines() if ln.startswith("## ")), "")
    existing = README_PATH.read_text(encoding="utf-8") if README_PATH.exists() else ""
    if heading and heading in existing:
        return
    with README_PATH.open("a", encoding="utf-8") as f:
        if existing and not existing.endswith("\n"):
            f.write("\n")
        f.write("\n" + section.strip() + "\n")
