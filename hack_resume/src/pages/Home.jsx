import React, { useState, useRef } from "react";
import { Navbar, Container, Button, Row, Col, Card, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import ResumeBuilder from "./ResumeBuilder";
import jsPDF from "jspdf";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [resumeData, setResumeData] = useState(null);
  const resumeRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateResume = () => {
    if (!formData.name || !formData.email) {
      alert("Please enter your name and email");
      return;
    }
    setShowModal(true);
  };

  const handleSaveResume = async (data) => {
    setResumeData(data);
    setShowModal(false);
    
    // Generate PDF after a short delay to allow modal to close otherwise there's a weird lag
    setTimeout(() => {
      generatePDF(data);
    }, 500);
  };

  const generatePDF = async (data) => {
    try {
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;
      
      // Add header with background color
      pdf.setFillColor(52, 58, 64); // Dark gray
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      // Name in header
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text(data.personalInfo.name, margin, 30);
      
      // Contact info in header
      pdf.setFontSize(11);
      let contactInfo = [];
      if (data.personalInfo.email) contactInfo.push(data.personalInfo.email);
      if (data.personalInfo.phone) contactInfo.push(data.personalInfo.phone);
      if (data.personalInfo.address) contactInfo.push(data.personalInfo.address);
      if (data.personalInfo.linkedin) contactInfo.push(`LinkedIn: ${data.personalInfo.linkedin}`);
      if (data.personalInfo.portfolio) contactInfo.push(`Portfolio: ${data.personalInfo.portfolio}`);
      
      pdf.text(contactInfo.join(' | '), margin, 40);
      
      // Reset text color for content
      pdf.setTextColor(0, 0, 0);
      yPosition = 60;
      
      // Add sections 
      const addSection = (title, content) => {
        // Section title
        pdf.setFontSize(16);
        pdf.setDrawColor(52, 58, 64);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
        
        pdf.text(title, margin, yPosition);
        yPosition += 10;
        
        // Section content
        pdf.setFontSize(11);
        const contentLines = pdf.splitTextToSize(content, pageWidth - 2 * margin);
        pdf.text(contentLines, margin, yPosition);
        yPosition += (contentLines.length * 6) + 15;
      };
      
      // Education section
      if (data.education && data.education.length > 0) {
        let educationContent = "";
        data.education.forEach(edu => {
          if (edu.school) {
            educationContent += `${edu.school}\n`;
            if (edu.degree) educationContent += `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}\n`;
            if (edu.startDate || edu.endDate) {
              educationContent += `${edu.startDate || ''} - ${edu.endDate || ''}\n`;
            }
            if (edu.description) educationContent += `${edu.description}\n`;
            educationContent += "\n";
          }
        });
        
        if (educationContent) {
          addSection("EDUCATION", educationContent);
        }
      }
      
      // Experience section
      if (data.experience && data.experience.length > 0) {
        let experienceContent = "";
        data.experience.forEach(exp => {
          if (exp.company) {
            experienceContent += `${exp.company}\n`;
            if (exp.position) experienceContent += `${exp.position}\n`;
            if (exp.startDate || exp.endDate) {
              experienceContent += `${exp.startDate || ''} - ${exp.endDate || ''}\n`;
            }
            if (exp.description) experienceContent += `${exp.description}\n`;
            experienceContent += "\n";
          }
        });
        
        if (experienceContent) {
          addSection("EXPERIENCE", experienceContent);
        }
      }
      
      // Skills section
      if (data.skills && data.skills.length > 0) {
        addSection("SKILLS", data.skills.join(', '));
      }
      
      // Save the PDF
      pdf.save(`${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
      
      // Store the resume data in localStorage
      const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '[]');
      const newResume = {
        id: Date.now(),
        title: `${data.personalInfo.name}'s Resume`,
        data: data,
        createdAt: new Date().toISOString(),
        // Add a preview of the resume for display purposes
        preview: {
          name: data.personalInfo.name,
          email: data.personalInfo.email,
          title: data.experience.length > 0 ? data.experience[0].position : 'No title'
        }
      };
      savedResumes.push(newResume);
      localStorage.setItem('savedResumes', JSON.stringify(savedResumes));
      
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error saving resume. Please try again.');
    }
  };

  return (
    <>
      <Navbar expand="md" variant="dark" className="bg-primary shadow-sm">
        <Container>
          <Navbar.Brand className="fw-semibold">Hack Resume</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" className="justify-content-end">
            <Button as={Link} to="/applications" variant="outline-light" className="me-2">
              Application Tracker
            </Button>

            <Button as={Link} to="/resumes" variant="light">
              Tailor Resume
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {}
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

      {/* Resume Builder Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="xl"
        fullscreen="lg-down"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Resume Builder</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <ResumeBuilder 
            initialData={formData} 
            onSave={handleSaveResume} 
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hidden div for PDF generation */}
      <div ref={resumeRef} style={{ display: 'none' }}></div>
    </>
  );
}