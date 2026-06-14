import argparse
import csv
import json
import re
import shutil
from pathlib import Path

from constants import FIELDS, KEYWORDS, VENUES
from loguru import logger

REPO_ROOT = Path(__file__).parent.parent


def filter_missing_papers(papers):
    """Filter out papers with missing key fields: TITLE, AUTHOR, VENUE, ARXIV."""
    filtered_papers = []
    for paper in papers:
        if (
            paper.get("TITLE", "") == ""
            or paper.get("AUTHOR", "") == ""
            or paper.get("VENUE", "") == ""
            or paper.get("ARXIV", "") == ""
        ):
            logger.warning(
                f"Missing key fields in paper: {paper.get('TITLE', 'Unknown Title')}"
            )
            continue
        filtered_papers.append(paper)

    return filtered_papers


def check_keywords(papers):
    """Check if the paper contains only the right keywords. Fixes issues related to capitalization and spacing."""
    kw_list = list(KEYWORDS.keys())
    kw_list_lower = [kw.lower() for kw in kw_list]
    for paper in papers:
        all_kws = ""
        keywords = paper.get("KEYWORD", "")
        for keyword in keywords.split(","):
            kw = keyword.strip().lower()
            if not kw:
                continue
            # get index of the correct keyword in KEYWORDS
            idx_kw = kw_list_lower.index(kw) if kw in kw_list_lower else -1
            if idx_kw != -1:
                all_kws += kw_list[idx_kw] + ", "
            else:
                logger.warning(
                    f"Unexpected keyword '{keyword.strip()}' in paper: {paper.get('TITLE', 'Unknown TITLE')}"
                )
        # if one of manipulation ,navigation, planning, xr, llm, sun, policy is keyword but not application, add application
        extra_kws = [
            "manipulation",
            "navigation",
            "planning",
            "xr",
            "llm",
            "sun",
            "policy",
        ]
        if (
            any(kw in all_kws.lower() for kw in extra_kws)
            and "Application" not in all_kws
        ):
            all_kws = "Application, " + all_kws
        paper["KEYWORD"] = all_kws[:-2]  # remove the last ', '
    return papers


def split_authors(authors_str):
    if authors_str.strip() == "":
        logger.warning("Empty authors string")
        return []
    authors = []
    for autor in authors_str.split(","):
        name_parts = autor.strip().split(" ")
        last_name = name_parts[-1]
        first_names = " ".join(name_parts[:-1])
        authors.append((first_names, last_name))
    return authors


def author_string(authors):
    authors_string = ""
    for first_names, last_name in authors:
        authors_string += f"{last_name}, {first_names} and "
    return authors_string[:-5]  # remove the last ' and '


def select_bib(venue_full):
    if venue_full == "arXiv preprint":
        return "misc", "archivePrefix"
    if "conf." in venue_full.lower() or "conference" in venue_full.lower():
        return "inproceedings", "booktitle"
    else:
        return ("article", "journal")


def generate_bibtex(papers):
    # create the bibtex entries
    for paper in papers:
        authors = split_authors(paper.get("AUTHOR", ""))
        author_str = author_string(authors)
        bib_key = paper["BIBTEX_KEY"]
        venue_full = VENUES.get(paper["VENUE"][:-2].lower(), "")
        if venue_full == "":
            logger.warning(
                f"Venue {paper['VENUE'][:-2]} not found in VENUES dictionary for paper {paper['TITLE']}"
            )
        year = f"20{paper['VENUE'][-2:]}"
        type_article, type_ref = select_bib(venue_full)
        bibtex_entry = f"@{type_article}{{{bib_key},\n"
        bibtex_entry += f"  title = {{{paper['TITLE']}}},\n"
        bibtex_entry += f"  author = {{{author_str}}},\n"
        bibtex_entry += f"  {type_ref} = {{{venue_full}}},\n"
        bibtex_entry += f"  year = {{{year}}}\n"
        bibtex_entry += "}"
        paper["BIBTEX"] = bibtex_entry
    return papers


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="This function takes as input a CSV file containing information of the 3DSG papers. It removes papers with missing key fields, generate the correct bibtex and output the final JSON file to be uploaded on the website."
    )
    parser.add_argument(
        "input_csv",
        nargs="?",
        default=None,
        help="Path to the input CSV file",
    )
    parser.add_argument(
        "output_dir",
        nargs="?",
        default=str(REPO_ROOT / "papers"),
        help="Path to the output papers/ directory (default: repo root papers/)",
    )

    args = parser.parse_args()
    if not args.input_csv:
        parser.error("input_csv is required")

    papers = []
    with open(args.input_csv, mode="r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            papers.append({k.upper(): v.strip() for k, v in row.items()})

    filtered_papers = filter_missing_papers(papers)
    filtered_papers = check_keywords(filtered_papers)
    final_papers = generate_bibtex(filtered_papers)

    out_dir = Path(args.output_dir)
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)

    def extract_bibkey(bibtex):
        m = re.search(r'@\w+\{([^,\s]+)', bibtex)
        return m.group(1) if m else None

    for paper in final_papers:
        if "BIBTEX_KEY" in paper:
            del paper["BIBTEX_KEY"]
        key = extract_bibkey(paper.get("BIBTEX", ""))
        if not key:
            logger.warning(f"No bibkey for {paper.get('TITLE')} — skipping")
            continue
        (out_dir / f"{key}.json").write_text(
            json.dumps(paper, indent=2, ensure_ascii=False), encoding="utf-8"
        )

    logger.info(f"Written {len(final_papers)} papers to {out_dir}/")
