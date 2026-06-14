import Container from 'react-bootstrap/Container';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function NavbarComponent() {
  const location = useLocation();
  const isHome = location?.pathname === '/';
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="top" expanded={expanded}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <Image src="small-logo.svg" fluid className={isHome ? 'invisible-logo' : ''} />
        </Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded((prev) => !prev)} />
        <Navbar.Collapse>
          <Nav className="ms-auto gap-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/advanced-search', label: 'Advanced Search' },
              { to: '/contribute', label: 'Contribute' },
              { to: '/about', label: 'About Us' },
              { to: '/faq', label: 'FAQ' },
            ].map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Nav.Link
                  as={Link}
                  to={to}
                  key={to}
                  className={isActive ? 'active' : ''}
                  onClick={() => setExpanded(false)} // close menu on click
                >
                  {label}
                </Nav.Link>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default NavbarComponent;
