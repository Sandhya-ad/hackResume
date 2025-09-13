// src/pages/Home.jsx
import { Navbar, Container, Button } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <Navbar expand="md" variant="dark" className="bg-navy shadow-sm">
        <Container>
          <Navbar.Brand className="fw-semibold">Hack Resume</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" className="justify-content-end">
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => {/* TODO: wire to /applications later */}}
            >
              Application Tracker
            </Button>
            <Button
              variant="primary"
              onClick={() => {/* TODO: wire to /tailor later */}}
            >
              Tailor Resume
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="py-5">
        <Container className="text-center">
          <h1 className="display-5 mb-3">Welcome to Hack Resume</h1>
          <p className="lead mb-4">Your one-stop solution for creating professional resumes.</p>
          <div className="d-flex justify-content-center">
            <Button size="lg" variant="outline-light" className="me-3">
              Application Tracker
            </Button>
            <Button size="lg" variant="primary">
              Tailor Resume
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
