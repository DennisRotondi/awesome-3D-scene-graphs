import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SURVEY } from '../surveyPaper';

const keywords = [
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

const FAQ: React.FC = () => {
  return (
    <Container className="mt-3 base_container px-0">
      <h3 className="mb-2">What is this website?</h3>
      <p>
        This website is a comprehensive database of research papers related to 3D Scene Graphs
        (3DSGs). It allows users to search, explore, and contribute to the growing body of knowledge
        in this field. It is a contribution from the paper{' '}
        {SURVEY.comingSoon ? (
          <>
            {SURVEY.title} (coming soon)
          </>
        ) : (
          <a href={SURVEY.url} target="_blank" rel="noopener noreferrer">
            {SURVEY.title}
          </a>
        )}
        .
      </p>

      <h3 className="mt-4 mb-2">How do I use the search functionality?</h3>
      <p>
        You can use the search bar on the homepage to search for papers by title. The{' '}
        <Link to={'/advanced-search'}>Advanced Search</Link> page allows you to filter papers based
        on various criteria, such as author, venue, date, and keywords. You can add multiple filters
        of the same type; these will act as OR within that type and AND across different types. To
        enforce an AND within the same query use &quot;&amp;&quot;, e.g. &quot;Manipulation &amp;
        Navigation&quot;. A comprehensive list of keywords used and their descriptions can be found
        below.
      </p>
      <Table
        responsive
        style={{
          borderSpacing: 0,
        }}
      >
        <thead>
          <tr>
            <th style={{ width: '25%', padding: '12px 0px' }}>Keyword</th>
            <th style={{ padding: '12px 0px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((item, idx) => (
            <tr key={idx}>
              <td
                style={{
                  padding: '10px 0px',
                }}
              >
                {item.term}
              </td>
              <td style={{ padding: '10px 0px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {item.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default FAQ;
