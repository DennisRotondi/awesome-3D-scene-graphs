import React, { useEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import NavbarComponent from './components/Navbar';

import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import AdvancedSearch from './pages/AdvancedSearch';
import Contribute from './pages/Contribute';
import Stats from './pages/Stats';

import Container from 'react-bootstrap/Container';
import FooterComponent from './components/FooterComponent';
import PaperPage from './pages/Paper';

import { papers } from './components/papers';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SITE_NAME = '3D Scene Graphs';
const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/faq': 'FAQ',
  '/contribute': 'Contribute',
  '/advanced-search': 'Advanced Search',
  '/stats': 'Stats',
};

// Set a distinct browser-tab title per route and report it with the GA pageview.
function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    let section = PAGE_TITLES[path];
    if (!section && path !== '/') {
      // Dynamic paper page (/:id) — use the paper's own title.
      const id = path.replace(/^\//, '');
      section = papers.find((p) => p.ID === id)?.TITLE;
    }
    const title = section ? `${section} | ${SITE_NAME}` : SITE_NAME;
    document.title = title;

    window.gtag?.('event', 'page_view', {
      page_path: path + location.search,
      page_title: title,
    });
  }, [location]);
  return null;
}

const App: React.FC = () => {
  return (
    <div className="app-container">
      <RouteTracker />
      {/* Navbar always visible */}
      <NavbarComponent />

      {/* Page content */}
      <Container className="mt-25">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<PaperPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/stats" element={<Stats />} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
      <FooterComponent />
    </div>
  );
};

export default App;
