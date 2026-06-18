#!/usr/bin/env python3
"""Validate paper JSON entries for awesome-3D-scene-graphs.

The controlled vocabularies (KEYWORDS, VENUES) live in scripts/constants.py and
are imported here so the validation rules never drift from what json_to_md.py and
the website expect. Standard library only -- no pip/uv install needed to run it.

Usage:
    python scripts/validate_papers.py                  # validate every papers/*.json
    python scripts/validate_papers.py papers/foo.json  # validate just these files
                                                       # (duplicate arXiv ids are still
                                                       #  checked against the whole folder)

Exit 0 = no hard errors. Non-zero = at least one hard error.
Warnings are printed but never change the exit code.
"""
from __future__ import annotations

import collections
import datetime
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

SCRIPTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPTS_DIR.parent
PAPERS_DIR = REPO_ROOT / "papers"

# Import the controlled vocabularies from the existing single source of truth.
sys.path.insert(0, str(SCRIPTS_DIR))
from constants import KEYWORDS, VENUES  # noqa: E402

# --- the schema -------------------------------------------------------------
# Every paper file must contain exactly these keys (no more, no fewer).
REQUIRED_NONEMPTY = (
    "TITLE", "VENUE", "DATE", "AUTHOR", "ABSTRACT", "ARXIV", "FIRSTINSTITUTE",
)
# Must be present, but may be "" (KEYWORD-empty just drops the paper into the
# README "Other" section; SITE/CODE/VIDEO/BIBTEX are genuinely optional).
PRESENT_MAYBE_EMPTY = ("KEYWORD", "SITE", "CODE", "VIDEO", "BIBTEX")
ALL_KEYS = set(REQUIRED_NONEMPTY) | set(PRESENT_MAYBE_EMPTY)
URL_FIELDS = ("ARXIV", "SITE", "CODE", "VIDEO")

DATE_RE = re.compile(r"^[0-9]{4}/[0-9]{2}/[0-9]{2}$")
FNAME_RE = re.compile(r"^[A-Za-z0-9_]+\.json$")
ARXIV_ID_RE = re.compile(r"arxiv\.org/(?:abs|pdf)/([0-9]{4}\.[0-9]{4,6})")
BIBKEY_RE = re.compile(r"@\w+\{([^,]+),")

errors: list[str] = []
warnings: list[str] = []


def err(name: str, msg: str) -> None:
    errors.append(f"❌ {name}: {msg}")


def warn(name: str, msg: str) -> None:
    warnings.append(f"⚠️  {name}: {msg}")


def is_http_url(value: str) -> bool:
    try:
        p = urlparse(value)
    except ValueError:
        return False
    return p.scheme in ("http", "https") and bool(p.netloc)


def validate_file(path: Path, arxiv_to_files: dict[str, list[str]]) -> None:
    name = path.name

    # --- extension / location ---
    if path.suffix != ".json":
        err(name, "not a .json file")
        return
    try:
        path.resolve().relative_to(PAPERS_DIR)
    except ValueError:
        err(name, "file is outside the papers/ folder")
        return
    if name.startswith("_"):
        return  # templates / helper files are not paper entries
    if not FNAME_RE.match(name):
        err(name, "filename must match [A-Za-z0-9_]+.json (no spaces, dashes or extra dots)")

    # --- bytes / encoding / parse ---
    raw = path.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        err(name, "file has a UTF-8 BOM; re-save as UTF-8 without BOM")
        return
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as e:
        err(name, f"not valid UTF-8: {e}")
        return
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        err(name, f"invalid JSON: {e}")
        return
    if not isinstance(data, dict):
        err(name, "top-level JSON must be an object")
        return

    # --- key set: exactly ALL_KEYS ---
    keys = set(data)
    for missing in sorted(ALL_KEYS - keys):
        err(name, f"missing required key {missing!r}")
    for extra in sorted(keys - ALL_KEYS):
        err(name, f"unexpected key {extra!r} (typo, or not part of the schema)")

    # all values must be strings
    for k in sorted(keys & ALL_KEYS):
        if not isinstance(data[k], str):
            err(name, f"{k} must be a string, got {type(data[k]).__name__}")

    # required fields must be non-empty
    for k in REQUIRED_NONEMPTY:
        if isinstance(data.get(k), str) and not data[k].strip():
            err(name, f"{k} is empty")

    def sval(k: str) -> str:
        v = data.get(k, "")
        return v.strip() if isinstance(v, str) else ""

    # --- DATE: YYYY/MM/DD, a real date, not (implausibly) in the future ---
    dt = sval("DATE")
    if dt:
        if not DATE_RE.match(dt):
            err(name, f"DATE {dt!r} is not in YYYY/MM/DD format")
        else:
            try:
                d = datetime.datetime.strptime(dt, "%Y/%m/%d").date()
            except ValueError:
                err(name, f"DATE {dt!r} is not a real calendar date")
            else:
                today = datetime.date.today()
                if d > today:
                    if d.year > today.year + 1:
                        err(name, f"DATE {dt} is implausibly far in the future (year typo?)")
                    else:
                        warn(name, f"DATE {dt} is in the future")

    # --- VENUE: <abbrev><2-digit year>; abbrev should be known ---
    v = sval("VENUE")
    if v:
        if not re.search(r"[0-9]{2}$", v):
            err(name, f"VENUE {v!r} must end with a 2-digit year (e.g. CVPR25, arXiv25)")
        else:
            abbr = v[:-2].lower()
            if abbr and abbr not in VENUES:
                warn(name, f"VENUE abbrev {abbr!r} not in constants.VENUES (typo, or add it there)")

    # --- KEYWORD: comma-separated, every token from the controlled list ---
    kw_raw = sval("KEYWORD")
    if not kw_raw:
        warn(name, "KEYWORD is empty (paper will land in the README 'Other' section)")
    else:
        toks = [t.strip() for t in kw_raw.split(",")]
        if any(t == "" for t in toks):
            warn(name, "KEYWORD has an empty entry (trailing or double comma?)")
        for t in toks:
            if t and t not in KEYWORDS:
                err(name, f"KEYWORD {t!r} is not in the controlled list (check casing against constants.KEYWORDS)")

    # --- URL fields: valid http(s) when present ---
    for k in URL_FIELDS:
        val = sval(k)
        if val and not is_http_url(val):
            err(name, f"{k} is not a valid http(s) URL: {val!r}")

    # --- ARXIV: present+URL already enforced above (REQUIRED_NONEMPTY + URL_FIELDS);
    #     warn (don't fail) if it isn't actually an arxiv.org link, so non-arXiv
    #     papers still pass CI while the oddity stays visible. The guard means we
    #     never double-report: empty already errored, non-URL already errored. ---
    ax = sval("ARXIV")
    if ax and is_http_url(ax):
        host = urlparse(ax).netloc.lower()
        if not (host == "arxiv.org" or host.endswith(".arxiv.org")):
            warn(name, f"ARXIV is a valid URL but not an arxiv.org link: {ax!r}")

    # --- BIBTEX: optional; if present must look like a bibtex entry ---
    bib = data.get("BIBTEX", "")
    if isinstance(bib, str):
        if not bib.strip():
            warn(name, "BIBTEX is empty (paste the entry when available)")
        else:
            if not bib.lstrip().startswith("@"):
                err(name, "BIBTEX should start with '@'")
            m = BIBKEY_RE.search(bib)
            if m and m.group(1).strip() != name[:-5]:
                warn(name, f"filename stem {name[:-5]!r} != BibTeX key {m.group(1).strip()!r} "
                           "(convention: name the file after the BibTeX key)")

    # --- duplicate arXiv id across the whole folder (arxiv.org links only) ---
    m = ARXIV_ID_RE.search(sval("ARXIV"))
    if m:
        others = [f for f in arxiv_to_files.get(m.group(1), []) if f != name]
        if others:
            err(name, f"duplicate arXiv id {m.group(1)} (also in {', '.join(sorted(others))})")


def build_arxiv_index(files: list[Path]) -> dict[str, list[str]]:
    """Map arXiv id -> [filenames] across every (parseable) file, so duplicates
    are detected regardless of which subset is being validated."""
    index: dict[str, list[str]] = collections.defaultdict(list)
    for p in files:
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue  # malformed files are reported by validate_file
        m = ARXIV_ID_RE.search(str(d.get("ARXIV", "")))
        if m:
            index[m.group(1)].append(p.name)
    return index


def main(argv: list[str]) -> int:
    if not PAPERS_DIR.is_dir():
        print(f"papers/ folder not found at {PAPERS_DIR}")
        return 2

    all_files = sorted(p for p in PAPERS_DIR.glob("*.json") if not p.name.startswith("_"))
    arxiv_to_files = build_arxiv_index(all_files)

    if argv:
        targets = [Path(a) for a in argv]
        real = [t for t in targets if not t.name.startswith("_")]
        if len(real) > 1:
            warn("(PR)", f"{len(real)} paper files changed in one PR; one paper per PR is preferred")
    else:
        targets = all_files
        real = all_files

    for path in targets:
        if not path.exists():
            err(path.name, "file does not exist")
            continue
        validate_file(path, arxiv_to_files)

    for w in warnings:
        print(w)
    for e in errors:
        print(e)

    print()
    if errors:
        print(f"\U0001f6d1 {len(errors)} error(s), {len(warnings)} warning(s). Fix the errors and push again.")
        return 1
    print(f"✅ OK -- {len(real)} file(s) validated, {len(warnings)} warning(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
