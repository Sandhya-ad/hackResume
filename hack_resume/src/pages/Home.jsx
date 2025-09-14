import React, { useState } from "react";
import { Navbar, Container, Button, Row, Col, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getMasterResume } from "../utils/storage";
import logo from "../assets/logo-hackresume.png";
import talentGraphic from "../assets/talent-graphic.png";
import ctaLogos from "../assets/cta-logos.png"; // ⭐ your blue image

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  const masterResume = getMasterResume();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateResume = () => {
    if (!formData.name || !formData.email) {
      alert("Please enter your name and email");
      return;
    }
    navigate("/resume-builder", { state: { initialData: formData } });
  };

  const handleViewResumes = () => {
    navigate("/my-resumes");
  };

  const handleCreateFromMaster = () => {
    navigate("/resume-builder", { state: { fromMaster: true } });
  };

  // ===== HERO STYLES =====
  const heroStyles = {
    padding: "16px 0 28px",
    display: "flex",
    alignItems: "flex-start",
  };

  const headlineStyle = {
    fontSize: "clamp(24px, 3.6vw, 40px)",
    lineHeight: 1.2,
    marginBottom: 8,
    color: "#111827",
  };

  const subheadStyle = {
    fontSize: "clamp(14px, 1.3vw, 18px)",
    lineHeight: 1.45,
    marginBottom: 14,
    fontWeight: 500,
    color: "#1f2937",
    maxWidth: 640,
  };

  const imageStyles = {
    width: "100%",
    height: "auto",
    maxWidth: 700,
    borderRadius: 16,
    boxShadow: "0 14px 36px rgba(0,0,0,0.15)",
    marginTop: -6,
  };

  const formCardStyles = {
    maxWidth: 500,
    width: "100%",
    marginLeft: "auto",
    marginTop: "-16px",
    background: "#102048",
    color: "#fff",
    minHeight: "480px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  // ===== FEATURES SECTION =====
  const featuresWrapStyle = {
    background: "#f8fafc",
    padding: "64px 0 72px",
  };

  const featuresHeadingStyle = {
    color: "#102048",
    fontWeight: 800,
    fontSize: "clamp(22px, 2.8vw, 36px)",
    textAlign: "center",
    marginBottom: 36,
  };

  const featureCardStyle = {
    background: "#e2e8f0",
    border: "0",
    borderRadius: "16px",
  };

  const featureTitleStyle = {
    color: "#0f172a",
    fontWeight: 700,
    fontSize: "clamp(18px, 2.2vw, 24px)",
    lineHeight: 1.25,
    marginBottom: 12,
  };

  const featureTextStyle = {
    color: "#334155",
    fontSize: "clamp(14px, 1.2vw, 17px)",
    lineHeight: 1.55,
    margin: 0,
  };

  // ===== CTA SECTION (blue ratings) =====
  const ctaWrapStyle = {
    background: "#0F1F44",
    color: "#fff",
    padding: "28px 0", // smaller blue band
  };

  const ctaHeadlineStyle = {
    fontSize: "clamp(22px, 3vw, 36px)",
    lineHeight: 1.15,
    fontWeight: 800,
    margin: 0,
  };

  const ctaLogosStyle = {
    width: "100%",
    height: "auto",
    maxWidth: 480, // a bit narrower
    marginTop: 16,
    opacity: 0.95,
    filter: "drop-shadow(0 6px 14px rgba(0,0,0,.18))",
  };

  const ctaButtonStyle = {
    background: "#ffffff",
    color: "#0F1F44",
    border: "0",
    padding: "12px 20px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: "clamp(14px, 1.2vw, 16px)",
    boxShadow: "0 10px 28px rgba(0,0,0,.20)",
  };

  // white gap after blue band
  const whiteGapStyle = {
    background: "#ffffff",
    height: 32, // visible white after blue
  };

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      {/* NAVBAR */}
      <Navbar expand="md" variant="dark" className="navbar-hr sticky-top py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
            <img src={logo} alt="Hack Resume logo" height={110} />
            <span className="m-0" style={{ fontSize: "clamp(20px, 2.2vw, 30px)", fontWeight: 800 }}>
              Hack Resume
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" className="justify-content-end">
            <Button variant="outline-light" className="me-2" onClick={handleViewResumes}>
              My Resumes
            </Button>
            <Button as={Link} to="/applications" variant="outline-light">
              Application Tracker
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* HERO */}
      <section className="bg-light" style={heroStyles}>
        <Container fluid="xl">
          <Row className="align-items-center g-4">
            <Col lg={6} className="pe-lg-4">
              <h1 className="fw-bold" style={headlineStyle}>
                Create a Professional Resume in Minutes
              </h1>
              <p style={subheadStyle}>
                Build a standout resume that gets you noticed by employers. Our easy-to-use builder
                helps you create a customized resume for any job application.
              </p>

              <div className="mt-2">
                <img
                  src={talentGraphic}
                  alt="Ready to find and manage top talent"
                  style={imageStyles}
                />
              </div>
            </Col>

            <Col lg={6} className="ps-lg-4">
              <Card className="shadow-lg border-0 ms-lg-auto" style={formCardStyles}>
                <Card.Body className="p-5">
                  <h2 className="h4 fw-bold text-white mb-3">Start Building Your Resume</h2>
                  <p className="mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
                    Enter your basic information to get started.
                  </p>

                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateResume();
                    }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Full Name<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Email<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Phone Number</Form.Label>
                      <Form.Control
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                      />
                    </Form.Group>

                    <div className="d-grid mt-4">
                      <Button onClick={handleCreateResume} variant="primary" size="lg">
                        Create New Resume
                      </Button>
                    </div>

                    {masterResume && (
                      <div className="d-grid mt-2">
                        <Button onClick={handleCreateFromMaster} variant="outline-primary" size="lg">
                          Create from Master Template
                        </Button>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURES */}
      <section style={featuresWrapStyle}>
        <Container>
          <h2 style={featuresHeadingStyle}>Why Choose Hack Resume?</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card style={featureCardStyle} className="h-100 shadow-sm">
                <Card.Body className="p-4 p-md-5">
                  <h3 style={featureTitleStyle}>Instant Sharing</h3>
                  <p style={featureTextStyle}>
                    Download polished PDFs or share your resume online with a single link. Our
                    templates are optimized for recruiters and applicant tracking systems.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={featureCardStyle} className="h-100 shadow-sm">
                <Card.Body className="p-4 p-md-5">
                  <h3 style={featureTitleStyle}>Smart Suggestions</h3>
                  <p style={featureTextStyle}>
                    Get content tips tailored to your industry. Our AI helps refine wording,
                    highlight achievements, and align your resume with the job you want.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={featureCardStyle} className="h-100 shadow-sm">
                <Card.Body className="p-4 p-md-5">
                  <h3 style={featureTitleStyle}>Organized & Professional</h3>
                  <p style={featureTextStyle}>
                    Keep track of applications, updates, and versions all in one place. Present
                    yourself with a modern design that leaves a lasting impression.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA SECTION (smaller blue + white gap after) */}
      <section style={ctaWrapStyle}>
        <Container fluid="xl">
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <h2 style={ctaHeadlineStyle}>Ready to find and manage top talent?</h2>
              <img src={ctaLogos} alt="Top-rated by trusted platforms" style={ctaLogosStyle} />
            </Col>
            <Col lg={4} className="text-lg-end">
              <Button
                style={ctaButtonStyle}
                onClick={() => navigate("/resume-builder", { state: { initialData: formData } })}
              >
                Try Hack Resume →
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* White breathing room after blue */}
      <section style={whiteGapStyle} />

      {/* FOOTER */}
      <footer className="py-4 bg-dark text-light text-center">
        <Container>
          <p className="m-0">&copy; {new Date().getFullYear()} Hack Resume. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}
