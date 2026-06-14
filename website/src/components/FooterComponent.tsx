import React from 'react';
import { Container } from 'react-bootstrap';

const FooterComponent: React.FC = () => {
  return (
    <footer className="mt-auto py-3">
      <Container className="footer d-flex justify-content-center align-items-center">
        A 3D Scene Graph Survey Project © {new Date().getFullYear()}
      </Container>
    </footer>
  );
};

export default FooterComponent;
