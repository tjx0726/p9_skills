"""Offline correctness tests for identifier conversion; no account or network access."""

import importlib.util
import json
from pathlib import Path
import random
import subprocess
import sys
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "isbn.py"
SPEC = importlib.util.spec_from_file_location("delivery_isbn", SCRIPT)
ISBN = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(ISBN)


class ISBNTests(unittest.TestCase):
    def test_known_pairs_both_directions(self):
        pairs = [("9889701006", "9789889701000"),
                 ("039304002X", "9780393040029"),
                 ("0306406152", "9780306406157")]
        for short, long in pairs:
            with self.subTest(isbn=short):
                self.assertEqual(ISBN.convert(short)["isbn13"], long)
                self.assertEqual(ISBN.convert(long)["isbn10"], short)
                self.assertEqual(ISBN.convert(short)["isbn13_provenance"], "derived")
                self.assertEqual(ISBN.convert(long)["isbn13_provenance"], "observed-normalized")

    def test_labels_separators_and_lowercase_x(self):
        for raw in ("ISBN-10: 0-393-04002-x", "ISBN 10: 0 393 04002 X",
                    " ISBN: 0\u2011393\u201104002\u2011X "):
            with self.subTest(raw=raw):
                result = ISBN.convert(raw)
                self.assertEqual(result["raw_input"], raw)
                self.assertEqual(result["isbn10"], "039304002X")
        self.assertEqual(ISBN.convert("ISBN-13: 978-988-97010-0-0")["isbn10"], "9889701006")

    def test_979_has_no_isbn10(self):
        result = ISBN.convert("9791090636071")
        self.assertEqual(result["isbn13"], "9791090636071")
        self.assertIsNone(result["isbn10"])
        self.assertIsNone(result["isbn10_provenance"])
        self.assertEqual(result["isbn10_status"], "not_applicable_979")

    def test_reject_other_identifier_types(self):
        for raw in ("9771234567003", "ISSN 1234-5679", "9790000000001", "0000000000109"):
            with self.subTest(raw=raw), self.assertRaises(ValueError):
                ISBN.convert(raw)

    def test_reject_bad_checksums_and_malformed_values(self):
        for raw in ("0306406153", "9780306406158", "ISBN-10: 9780306406157",
                    "ISBN-13: 0306406152", "X393040020", "039304002?",
                    "０３０６４０６１５２", "306406152", "9780306406157 51234",
                    "9780306406157 + 51234", "book: 0306406152", "", 306406152, None):
            with self.subTest(raw=raw), self.assertRaises(ValueError):
                ISBN.convert(raw)

    def test_single_digit_errors_are_not_repaired(self):
        for original in ("9889701006", "9789889701000", "039304002X"):
            for index, old in enumerate(original):
                for new in "0123456789":
                    if old == new:
                        continue
                    raw = original[:index] + new + original[index + 1:]
                    with self.subTest(raw=raw), self.assertRaises(ValueError):
                        ISBN.convert(raw)

    def test_roundtrip_and_independent_modular_invariants(self):
        rng = random.Random(971)
        for _ in range(1000):
            body = "{:09d}".format(rng.randrange(10 ** 9))
            # Equivalent ascending-weight congruence, independent of implementation.
            check = sum((i + 1) * int(d) for i, d in enumerate(body)) % 11
            short = body + ("X" if check == 10 else str(check))
            long = ISBN.convert(short)["isbn13"]
            self.assertEqual(ISBN.convert(long)["isbn10"], short)
            self.assertEqual(sum(int(d) * (1 if i % 2 == 0 else 3)
                                 for i, d in enumerate(long)) % 10, 0)

    def test_cli_mixed_batch_reports_partial_results_and_failure(self):
        run = subprocess.run([sys.executable, str(SCRIPT), "--", "0-393-04002-X",
                              "9780306406158", "9791090636071"],
                             text=True, capture_output=True, check=False)
        self.assertEqual(run.returncode, 1)
        rows = json.loads(run.stdout)["results"]
        self.assertEqual(rows[0]["isbn13"], "9780393040029")
        self.assertEqual(rows[1]["status"], "invalid_or_not_isbn")
        self.assertNotIn("isbn13", rows[1])
        self.assertEqual(rows[2]["isbn10_status"], "not_applicable_979")
        self.assertEqual(run.stderr, "")

    def test_cli_valid_batch_succeeds(self):
        run = subprocess.run([sys.executable, str(SCRIPT), "9889701006", "9780393040029"],
                             text=True, capture_output=True, check=False)
        self.assertEqual(run.returncode, 0)
        self.assertEqual(len(json.loads(run.stdout)["results"]), 2)


if __name__ == "__main__":
    unittest.main()
