from __future__ import annotations


def expected_sap(canonical: str) -> str:
    return f"100-{canonical}"


def expected_pi(canonical: str) -> str:
    return "U100" + canonical.replace("-", "")


def expected_dwg(canonical: str) -> str:
    if canonical.startswith("PSV-"):
        num = int(canonical.split("-")[1])
        return f"101-PSV-{num:03d}"
    kind, rest = canonical.split("-", 1)
    digits = "".join(ch for ch in rest if ch.isdigit())
    suffix = "".join(ch for ch in rest if ch.isalpha())
    seq = int(digits[-2:]) if len(digits) >= 2 else int(digits)
    return f"101-{kind}-{seq:03d}{suffix}"
