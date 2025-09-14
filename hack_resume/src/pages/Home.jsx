import React, { useState } from "react";
import { Navbar, Container, Button, Row, Col, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getResumes } from "../utils/storage";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateResume = () => {
    if (!formData.name || !formData.email) {
      alert("Please enter at least your name and email");
      return;
    }
    
    // Navigate to ResumeBuilder with initial data
    navigate('/resume-builder', { 
      state: { 
        initialData: formData 
      } 
    });
  };

  const handleViewResumes = () => {
    const resumes = getResumes();
    if (resumes.length === 0) {
      alert("You don't have any saved resumes yet. Create one first!");
    } else {
      navigate('/my-resumes');
    }
  };

  return (
    <>
      <Navbar expand="md" variant="dark" className="bg-primary shadow-sm">
        <Container>
          <Navbar.Brand className="fw-semibold">Hack Resume</Navbar.Brand>
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

      {/* Hero section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center g-4">
            {/* Left side headline & blurb */}
            <Col lg={6}>
              <h1 className="display-4 fw-bold text-dark lh-tight">
                Create a Professional Resume in Minutes
              </h1>
              <p className="lead text-muted mt-3">
                Build a standout resume that gets you noticed by employers. Our easy-to-use builder helps you create a customized resume for any job application.
              </p>
              <div className="mt-4">
                <div className="d-flex">
                  <div className="me-3">
                    <h5 className="fw-bold">✓ ATS-Friendly</h5>
                    <p className="text-muted small">Optimized for applicant tracking systems</p>
                  </div>
                  <div className="me-3">
                    <h5 className="fw-bold">✓ Professional Templates</h5>
                    <p className="text-muted small">Choose from industry-specific designs</p>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right side simple form */}
            <Col lg={6}>
              <Card className="shadow-lg border-0">
                <Card.Body className="p-4 p-md-5">
                  <h2 className="h3 text-primary mb-2">Start Building Your Resume</h2>
                  <p className="text-secondary mb-4">
                    Enter your basic information to get started.
                  </p>

                  <Form>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Label>Full Name<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                        />
                      </Col>

                      <Col xs={12}>
                        <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          placeholder="john.doe@example.com"
                          required
                        />
                      </Col>

                      <Col xs={12}>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          placeholder="(123) 456-7890"
                        />
                      </Col>

                      <Col xs={12} className="d-grid mt-4">
                        <Button 
                          onClick={handleCreateResume} 
                          variant="primary" 
                          size="lg"
                        >
                          Create My Resume
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}