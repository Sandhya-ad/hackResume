import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getResumes, deleteResume } from "../utils/storage";
import jsPDF from "jspdf";

export default function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    const savedResumes = getResumes();
    setResumes(savedResumes);
  };

  const viewResume = (resume) => {
    setSelectedResume(resume);
    setShowViewer(true);
  };

  const editResume = (resumeId) => {
    navigate('/resume-builder', { state: { resumeId } });
  };

  const handleDeleteResume = (resumeId, resumeTitle) => {
    if (window.confirm(`Are you sure you want to delete "${resumeTitle}"?`)) {
      const success = deleteResume(resumeId);
      if (success) {
        loadResumes();
        alert("Resume deleted successfully!");
      } else {
        alert("Error deleting resume. Please try again.");
      }
    }
  };

  const createNewResume = () => {
    navigate('/resume-builder');
  };

  const downloadPDF = (resume) => {
    if (!resume || !resume.data) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;
      
      // Add header with background color
      pdf.setFillColor(52, 58, 64);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      // Name in header
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text(resume.data.personalInfo.name || "Resume", margin, 30);
      
      // Contact info in header
      pdf.setFontSize(11);
      let contactInfo = [];
      if (resume.data.personalInfo.email) contactInfo.push(resume.data.personalInfo.email);
      if (resume.data.personalInfo.phone) contactInfo.push(resume.data.personalInfo.phone);
      if (resume.data.personalInfo.address) contactInfo.push(resume.data.personalInfo.address);
      
      pdf.text(contactInfo.join(' | '), margin, 40);
      
      pdf.setTextColor(0, 0, 0);
      yPosition = 60;
      
      // Add sections
      const addSection = (title, content) => {
        if (!content || content.trim() === "") return;
        
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
        addSection("EDUCATION", educationContent);
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
        addSection("EXPERIENCE", experienceContent);
      }
      
      // Skills section
      if (resume.data.skills && resume.data.skills.length > 0) {
        addSection("SKILLS", resume.data.skills.join(', '));
      }
      
      // Save the PDF
      const fileName = resume.data.personalInfo.name 
        ? `${resume.data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'My_Resume.pdf';
      
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">My Resumes</h2>
        <div>
          <Button variant="outline-light" className="me-2" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="primary" onClick={createNewResume}>
            Create New Resume
          </Button>
        </div>
      </div>

      {resumes.length === 0 ? (
        <Card className="text-center py-5 bg-dark text-white">
          <Card.Body>
            <h5>No resumes yet</h5>
            <p className="text-muted">You haven't created any resumes yet.</p>
            <Button variant="primary" onClick={createNewResume}>
              Create Your First Resume
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Alert variant="info" className="bg-dark text-white border-light">
            You have {resumes.length} saved resume{resumes.length !== 1 ? 's' : ''}
          </Alert>
          
          <Row>
            {resumes.map((resume) => (
              <Col md={6} lg={4} key={resume.id} className="mb-4">
                <Card className="h-100 bg-dark text-white border-light">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-white">{resume.title}</Card.Title>
                    
                    <Card.Text className="text-light">
                      <small>
                        Created: {new Date(resume.createdAt).toLocaleDateString()}
                        <br />
                        Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                      </small>
                    </Card.Text>

                    {resume.data.personalInfo.name && (
                      <div className="mb-2">
                        <strong className="text-white">{resume.data.personalInfo.name}</strong>
                        {resume.data.personalInfo.email && (
                          <div className="text-light small">{resume.data.personalInfo.email}</div>
                        )}
                      </div>
                    )}

                    <div className="mt-auto">
                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-light"
                          size="sm"
                          onClick={() => viewResume(resume)}
                        >
                          View Resume
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => editResume(resume.id)}
                        >
                          Edit Resume
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => downloadPDF(resume)}
                        >
                          Download PDF
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteResume(resume.id, resume.title)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Resume Viewer Modal */}
      <Modal show={showViewer} onHide={() => setShowViewer(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white border-light">
          <Modal.Title>{selectedResume?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {selectedResume && (
            <>
              <h4 className="text-white">{selectedResume.data.personalInfo.name}</h4>
              <p className="text-light">
                {selectedResume.data.personalInfo.email} | {selectedResume.data.personalInfo.phone}
                {selectedResume.data.personalInfo.address && ` | ${selectedResume.data.personalInfo.address}`}
              </p>

              {selectedResume.data.education && selectedResume.data.education.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-white">Education</h5>
                  {selectedResume.data.education.map((edu, index) => (
                    <div key={index} className="mb-2 text-light">
                      <strong>{edu.school}</strong>
                      <p>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                      <small>{edu.startDate} - {edu.endDate}</small>
                      {edu.description && <p>{edu.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {selectedResume.data.experience && selectedResume.data.experience.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-white">Experience</h5>
                  {selectedResume.data.experience.map((exp, index) => (
                    <div key={index} className="mb-2 text-light">
                      <strong>{exp.company}</strong>
                      <p>{exp.position}</p>
                      <small>{exp.startDate} - {exp.endDate}</small>
                      {exp.description && <p>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {selectedResume.data.skills && selectedResume.data.skills.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-white">Skills</h5>
                  <div className="d-flex flex-wrap gap-1">
                    {selectedResume.data.skills.map((skill, index) => (
                      <span key={index} className="badge bg-light text-dark">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-light">
          <Button variant="outline-light" onClick={() => setShowViewer(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => selectedResume && downloadPDF(selectedResume)}>
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}