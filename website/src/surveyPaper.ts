export const GITHUB_REPO = 'https://github.com/DennisRotondi/awesome-3D-scene-graphs';

// === Single source of truth for the survey link ===========================
// When the preprint is live, set ARXIV_ID to the real id (e.g. '2509.12345')
// and flip comingSoon to false. The url, pdf and BibTeX eprint below all derive
// from ARXIV_ID, so that one edit links it everywhere on the site.
const ARXIV_ID = 'XXXX.XXXXX'; // placeholder until the survey is public
const TITLE = '3D Scene Graphs: Open Challenges and Future Directions';
const AUTHORS =
  'Dennis Rotondi and Francesco Argenziano and Sebastian Koch and Nathan Hughes and ' +
  'Martin B\\"uchner and Johanna Wald and Lukas Rosenberger Schmid and Daniele Nardi and ' +
  'Abhinav Valada and Liam Paull and Federico Tombari and Luca Carlone and Kai O. Arras';

export const SURVEY = {
  comingSoon: true,
  title: TITLE,
  url: `https://arxiv.org/abs/${ARXIV_ID}`,
  pdf: `https://arxiv.org/pdf/${ARXIV_ID}`,
  cover: 'preview.svg',
  bibtex: `@article{rotondi2026threedsg,
      title={${TITLE}},
      author={${AUTHORS}},
      year={2026},
      journal={arXiv preprint arXiv:${ARXIV_ID}}
  }`,
};
