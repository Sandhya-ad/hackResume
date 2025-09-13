import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("");

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '[]');
    setResumes(savedResumes);
  };

  const createResume = () => {
    if (!newResumeTitle) return;
    const newResume = { 
      id: Date.now(), 
      title: newResumeTitle, 
      content: "",
      createdAt: new Date().toISOString(),
      preview: {
        name: "New Resume",
        email: "",
        title: "No title"
      }
    };
    
    const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '[]');
    savedResumes.push(newResume);
    localStorage.setItem('savedResumes', JSON.stringify(savedResumes));
    
    setResumes(savedResumes);
    setShowModal(false);
    setNewResumeTitle("");
  };

  const deleteResume = (id) => {
    const updatedResumes = resumes.filter(res => res.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem('savedResumes', JSON.stringify(updatedResumes));
  };

  const downloadResume = (resume) => {
    // Regenerate the PDF from stored data
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;
    
    // Add header
    pdf.setFillColor(52, 58, 64);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text(resume.data.personalInfo.name, margin, 30);
    
    pdf.setFontSize(11);
    let contactInfo = [];
    if (resume.data.personalInfo.email) contactInfo.push(resume.data.personalInfo.email);
    if (resume.data.personalInfo.phone) contactInfo.push(resume.data.personalInfo.phone);
    
    pdf.text(contactInfo.join(' | '), margin, 40);
    
    pdf.setTextColor(0, 0, 0);
    yPosition = 60;
    
    // Add content sections
    const addSection = (title, content) => {
      pdf.setFontSize(16);
      pdf.setDrawColor(52, 58, 64);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      
      pdf.text(title, margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      const contentLines = pdf.splitTextToSize(content, pageWidth - 2 * margin);
      pdf.text(contentLines, margin, yPosition);
      yPosition += (contentLines.length * 6) + 15;
    };
    
    // Education section
    if (resume.data.education && resume.data.education.length > 0) {
      let educationContent = "";
      resume.data.education.forEach(edu => {
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
    if (resume.data.experience && resume.data.experience.length > 0) {
      let experienceContent = "";
      resume.data.experience.forEach(exp => {
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
    if (resume.data.skills && resume.data.skills.length > 0) {
      addSection("SKILLS", resume.data.skills.join(', '));
    }
    
    pdf.save(`${resume.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Resumes</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h5>No resumes yet</h5>
            <p className="text-muted">Click "Create New Resume" to get started or go to the home page to build one.</p>
            <Button as={Link} to="/" variant="primary">
              Go to Home Page
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {resumes.map((resume) => (
            <Col md={6} lg={4} key={resume.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="h5">{resume.title}</Card.Title>
                    <small className="text-muted">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  
                  {resume.preview && (
                    <div className="mb-3">
                      <div><strong>{resume.preview.name}</strong></div>
                      {resume.preview.email && <div className="text-muted small">{resume.preview.email}</div>}
                      {resume.preview.title && <div className="text-muted small">{resume.preview.title}</div>}
                    </div>
                  )}
                  
                  <div className="mt-auto d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => downloadResume(resume)}
                    >
                      Download PDF
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this resume?')) {
                          deleteResume(resume.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for creating a new resume */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Resume Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Software Engineer Resume"
                value={newResumeTitle}
                onChange={(e) => setNewResumeTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createResume}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}