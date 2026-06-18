// Canonical list of keywords used to tag papers.
// Shared by the FAQ page (reference table) and the Contribute form (keyword picker)
// so the two never drift apart. Order is preserved as displayed in the FAQ.
export type Keyword = {
  term: string;
  desc: string;
};

export const KEYWORDS: Keyword[] = [
  {
    term: 'Application',
    desc: 'Papers that demonstrate practical uses of 3DSGs beyond their construction.',
  },
  { term: 'Manipulation', desc: 'Papers that leverage 3DSGs to support object manipulation tasks.' },
  { term: 'Navigation', desc: 'Papers that leverage 3DSGs to support navigation tasks.' },
  { term: 'Planning', desc: 'Papers that leverage 3DSGs to support planning tasks.' },
  {
    term: 'XR',
    desc: 'Papers that connect XR interfaces with 3DSGs for immersive interaction and editing.',
  },
  { term: 'LLM', desc: 'Papers that integrate 3DSGs with LLMs for downstream tasks.' },
  { term: 'SUN', desc: 'Papers that leverage 3DSGs to perform scene understanding tasks.' },
  { term: 'Policy', desc: 'Papers that leverage 3DSGs to perform policy learning.' },
  { term: 'Multi-Robot', desc: 'Papers that consider 3DSGs in multi-robot collaboration.' },
  { term: 'Outdoor', desc: 'Papers that study 3DSGs in outdoor environments.' },
  { term: 'Indoor', desc: 'Papers that study 3DSGs in indoor environments.' },
  {
    term: 'Active',
    desc: 'Papers that build or update the graph through active interaction or perception.',
  },
  {
    term: 'Short-Term Dynamics',
    desc: 'Papers that ensure short-term temporal consistency, capturing updates and tracking dynamic entities.',
  },
  {
    term: 'Long-Term Dynamics',
    desc: 'Papers that capture long-term scene changes, focusing on the results of updates.',
  },
  {
    term: 'Compression',
    desc: 'Papers that maintain lightweight representations of the scene through compression.',
  },
  { term: 'Hierarchical', desc: 'Papers that organize the graph hierarchically.' },
  {
    term: 'Incremental',
    desc: 'Papers that process input incrementally, updating the graph as data arrives.',
  },
  {
    term: 'Real-Time',
    desc: 'Papers that perform incremental, on-device computation at sensor rate to enable real-time scene graph construction and updates.',
  },
  { term: 'Dataset', desc: 'Papers that introduce datasets for building or evaluating 3DSGs.' },
  {
    term: 'Pre-Built PCD',
    desc: 'Papers that leverage pre-built point cloud datasets for 3DSG construction.',
  },
  { term: 'RGB-D', desc: 'Papers that rely on RGB-D data for building 3DSGs.' },
  { term: 'LiDAR', desc: 'Papers that rely on LiDAR data for building 3DSGs.' },
  {
    term: 'SLAM',
    desc: 'Papers that couple 3DSG construction with SLAM to account for spatial uncertainty and ensure global consistency.',
  },
  {
    term: 'Open-Vocabulary',
    desc: 'Papers that adopt open-vocabulary approaches for flexible scene understanding.',
  },
  {
    term: 'Humans',
    desc: 'Papers that model humans in the scene, including their trajectories and interactions with the environment.',
  },
];
