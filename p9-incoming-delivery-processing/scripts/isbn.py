#!/usr/bin/env python3
"""Validate ISBN checksums and return equivalent ISBN-10/13 strings, offline."""

import argparse
import json
import re


def _check13(body):
    return str((-sum(int(d) * (1 if i % 2 == 0 else 3)
                     for i, d in enumerate(body))) % 10)


def _check10(body):
    digit = (-sum(int(d) * (10 - i) for i, d in enumerate(body))) % 11
    return "X" if digit == 10 else str(digit)


def convert(raw):
    """Raise ValueError for invalid/non-ISBN input; never repair its check digit."""
    if not isinstance(raw, str):
        raise ValueError("Pass the original ISBN as text; numeric input can lose leading zeros.")
    text = raw.strip()
    label = re.match(r"ISBN(?:[ -]?(10|13))?\s*:?\s*", text, re.IGNORECASE)
    declared_length = int(label.group(1)) if label and label.group(1) else None
    if label:
        text = text[label.end():]
    code = re.sub(r"[\s\-\u2010\u2011]", "", text).upper()
    if declared_length is not None and len(code) != declared_length:
        raise ValueError("ISBN label and identifier length disagree.")
    if len(code) == 10:
        if not re.fullmatch(r"[0-9]{9}[0-9X]", code):
            raise ValueError("ISBN-10 needs nine ASCII digits and a digit or final X.")
        if code[-1] != _check10(code[:9]):
            raise ValueError("Invalid ISBN-10 check digit; re-read the source instead of repairing it.")
        body = "978" + code[:9]
        return {
            "raw_input": raw, "normalized_input": code, "input_type": "ISBN-10",
            "status": "checksum_valid", "isbn10": code, "isbn13": body + _check13(body),
            "isbn10_provenance": "observed-normalized", "isbn13_provenance": "derived",
            "isbn10_status": "available",
        }
    if len(code) == 13:
        if not re.fullmatch(r"[0-9]{13}", code):
            raise ValueError("ISBN-13 needs thirteen ASCII digits.")
        if not code.startswith(("978", "979")):
            raise ValueError("This is not an ISBN prefix; retain other EAN/ISSN identifiers separately.")
        if code.startswith("9790"):
            raise ValueError("979-0 identifies ISMN, not ISBN; do not convert it as a book ISBN.")
        if code[-1] != _check13(code[:12]):
            raise ValueError("Invalid ISBN-13 check digit; re-read the source instead of repairing it.")
        body = code[3:12]
        has_legacy = code.startswith("978")
        return {
            "raw_input": raw, "normalized_input": code, "input_type": "ISBN-13",
            "status": "checksum_valid", "isbn10": body + _check10(body) if has_legacy else None,
            "isbn13": code, "isbn10_provenance": "derived" if has_legacy else None,
            "isbn13_provenance": "observed-normalized",
            "isbn10_status": "available" if has_legacy else "not_applicable_979",
        }
    raise ValueError("Expected a complete ISBN-10 or ISBN-13; do not pad digits or discard barcode add-ons.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("isbn", nargs="+", help="One quoted ISBN per argument; optional ISBN label/hyphens.")
    args = parser.parse_args()
    results = []
    failed = False
    for raw in args.isbn:
        try:
            results.append(convert(raw))
        except ValueError as exc:
            failed = True
            results.append({"raw_input": raw, "status": "invalid_or_not_isbn", "error": str(exc)})
    print(json.dumps({"results": results}, ensure_ascii=False, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
