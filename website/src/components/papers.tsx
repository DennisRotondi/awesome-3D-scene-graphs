export type Paper = {
  ID: string;
  TITLE: string;
  VENUE: string;
  DATE: string;
  AUTHOR: string;
  ABSTRACT: string;
  ARXIV: string;
  FIRSTINSTITUTE: string;
  KEYWORD: string;
  SITE: string;
  CODE: string;
  VIDEO: string;
  BIBTEX: string;
};

const modules = import.meta.glob<{ default: Paper }>('../assets/papers/*.json', { eager: true });

function extractBibKey(bibtex: string): string {
  const match = bibtex.match(/@\w+\{([^,\s]+)/);
  return match ? match[1] : '';
}

export const papers: Paper[] = (() => {
  const raw = Object.values(modules).map((m) => m.default);
  const seen = new Map<string, number>();
  const withIds = raw.map((paper, index) => {
    const base = extractBibKey(paper.BIBTEX) || String(index + 1);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    const id = count === 1 ? base : `${base}_${count}`;
    return { ...paper, ID: id };
  });
  // Load papers already oldest-first so the list renders in date order on the
  // first paint, with no post-mount re-sort (avoids the unsorted→sorted flash
  // on Advanced Search, where the sort default is now "Select...").
  return withIds.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
})();
