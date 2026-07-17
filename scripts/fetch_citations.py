"""Fetch citation counts for all papers from the Semantic Scholar API.

Writes website/src/citations.json mapping arXiv id -> citation count, which
the website's Connected Papers graph uses to scale node sizes.
Can be run from anywhere:
    uv run python fetch_citations.py             # from scripts/
    uv run python scripts/fetch_citations.py     # from repo root
"""

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PAPERS_DIR = REPO_ROOT / "papers"
OUTPUT = REPO_ROOT / "website" / "src" / "citations.json"

BATCH_URL = "https://api.semanticscholar.org/graph/v1/paper/batch?fields=citationCount,externalIds"
# Title fallback goes to OpenAlex: Semantic Scholar's title-match endpoint is
# too aggressively rate-limited without an API key.
MATCH_URL = "https://api.openalex.org/works?per-page=1&select=title,cited_by_count&filter=title.search:"
BATCH_SIZE = 500
MAX_RETRIES = 5


def arxiv_id(url: str) -> str | None:
    """Extract a bare arXiv id like '2402.12259' from an arXiv URL."""
    match = re.search(r"arxiv\.org/(?:abs|pdf)/([0-9]{4}\.[0-9]{4,5})", url)
    return match.group(1) if match else None


def request_json(request: urllib.request.Request):
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(request) as response:
                return json.loads(response.read())
        except urllib.error.HTTPError as e:
            if e.code == 429:  # rate limited; back off and retry
                wait = 5 * 2**attempt
                print(f"rate limited, retrying in {wait}s")
                time.sleep(wait)
                continue
            if e.code == 404:  # no match for a title query
                return None
            raise
    raise RuntimeError("still rate limited after retries")


def fetch_batch(ids: list[str]) -> list[dict | None]:
    body = json.dumps({"ids": [f"arXiv:{i}" for i in ids]}).encode()
    return request_json(
        urllib.request.Request(BATCH_URL, data=body, headers={"Content-Type": "application/json"})
    )


def fetch_by_title(title: str) -> int | None:
    """Fallback for papers whose link is not an arXiv URL (CVF, IEEE, Springer, ...)."""
    # Commas break OpenAlex filter syntax; they are not needed for the search
    query = urllib.parse.quote(title.replace(",", " "))
    result = request_json(urllib.request.Request(MATCH_URL + query))
    if not result or not result.get("results"):
        return None
    hit = result["results"][0]
    normalize = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())  # noqa: E731
    if normalize(hit.get("title") or "") != normalize(title):
        return None  # top hit is a different paper; better no size than a wrong one
    return hit.get("cited_by_count")


def main() -> None:
    # Keys in the output: bare arXiv id when the paper links to arXiv,
    # otherwise the lowercased title (the website does the same lookup).
    with_arxiv: list[tuple[str, str]] = []  # (arxiv id, title)
    without_arxiv: list[str] = []  # title
    for path in sorted(PAPERS_DIR.glob("*.json")):
        paper = json.loads(path.read_text())
        aid = arxiv_id(paper.get("ARXIV", ""))
        if aid:
            with_arxiv.append((aid, paper["TITLE"]))
        else:
            without_arxiv.append(paper["TITLE"])

    citations: dict[str, int] = {}
    title_fallback: list[str] = list(without_arxiv)
    for start in range(0, len(with_arxiv), BATCH_SIZE):
        batch = with_arxiv[start : start + BATCH_SIZE]
        for (aid, title), result in zip(batch, fetch_batch([a for a, _ in batch])):
            if result and result.get("citationCount") is not None:
                citations[aid] = result["citationCount"]
            else:
                title_fallback.append(title)

    missing = []
    for title in title_fallback:
        count = fetch_by_title(title)
        if count is not None:
            citations[title.lower()] = count
        else:
            missing.append(title)
        time.sleep(0.2)  # OpenAlex politeness

    OUTPUT.write_text(json.dumps(citations, indent=2, sort_keys=True) + "\n")
    print(f"wrote {len(citations)} counts to {OUTPUT}")
    if missing:
        print(f"not found on Semantic Scholar ({len(missing)}): {missing}")


if __name__ == "__main__":
    main()
