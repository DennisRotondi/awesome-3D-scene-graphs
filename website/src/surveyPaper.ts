export const GITHUB_REPO = 'https://github.com/DennisRotondi/awesome-3D-scene-graphs';

// === Single source of truth for the survey link ===========================
// When the preprint is live, set ARXIV_ID to the real id (e.g. '2509.12345')
// and flip comingSoon to false. The url, pdf and BibTeX eprint below all derive
// from ARXIV_ID, so that one edit links it everywhere on the site.
const ARXIV_ID = '2606.19383';
const TITLE = '3D Scene Graphs: Open Challenges and Future Directions';
// "Last, First" order (matches papers/rotondi2026survey.json so the Home cite
// box and the survey's paper page show the same BibTeX); the surname order also
// disambiguates the multi-word "Rosenberger Schmid".
const AUTHORS =
  'Rotondi, Dennis and Argenziano, Francesco and Koch, Sebastian and Hughes, Nathan and ' +
  'Büchner, Martin and Wald, Johanna and Rosenberger Schmid, Lukas and Nardi, Daniele and ' +
  'Valada, Abhinav and Paull, Liam and Tombari, Federico and Carlone, Luca and Arras, Kai O.';

export const SURVEY = {
  comingSoon: false,
  title: TITLE,
  url: `https://arxiv.org/abs/${ARXIV_ID}`,
  pdf: `https://arxiv.org/pdf/${ARXIV_ID}`,
  cover: 'preview.svg',
  bibtex: `@misc{rotondi2026survey,
  title = {${TITLE}},
  author = {${AUTHORS}},
  year = {2026},
  eprint = {${ARXIV_ID}},
  archivePrefix = {arXiv}
}`,
};
