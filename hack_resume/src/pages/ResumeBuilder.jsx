import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Accordion, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { getResumeById, saveResume } from "../utils/storage";
import { getResumeSuggestions } from "../utils/geminiApi"; // <-- ADD THIS


export default function ResumeBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const resumeId = location.state?.resumeId;
  const initialData = location.state?.initialData;
  
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      portfolio: ""
    },
    education: [],
    experience: [],
    skills: []
  });

  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);
  const [isNewResume, setIsNewResume] = useState(false);

  useEffect(() => {
    if (resumeId) {
      // Load existing resume
      const resume = getResumeById(resumeId);
      if (resume && resume.data) {
        setResumeData(resume.data);
      }
    } else if (initialData) {
      // Create new resume with initial data from home page
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone
        }
      }));
      setIsNewResume(true);
    } else {
      // Create a completely new resume
      setIsNewResume(true);
    }
  }, [resumeId, initialData]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    let resumeToSave;
    
    if (resumeId) {
      // Update existing resume
      const existingResume = getResumeById(resumeId);
      if (!existingResume) {
        resumeToSave = {
          id: Date.now(),
          title: `${resumeData.personalInfo.name || 'New'} Resume`,
          isMaster: true,
          data: resumeData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        resumeToSave = {
          ...existingResume,
          data: resumeData,
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // Create new resume
      resumeToSave = {
        id: Date.now(),
        title: `${resumeData.personalInfo.name || 'New'} Resume`,
        isMaster: true,
        data: resumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    // Save to storage
    const success = saveResume(resumeToSave);
    
    if (success) {
      setSaved(true);
      // Navigate to resume viewer after a brief delay
      setTimeout(() => {
        navigate('/my-resumes'); 
      }, 1000);
    } else {
      alert("Error saving resume. Please try again.");
    }
  };

  const handleAISuggestions = async () => {
  try {
    let resumeToSend;

    if (resumeId) {
      // Existing resume
      const storedResume = getResumeById(resumeId);
      resumeToSend = storedResume ? storedResume.data : resumeData;
    } else {
      // New resume
      resumeToSend = resumeData;
    }

    // Call the Gemini API
    const suggestions = await getResumeSuggestions(resumeToSend);

    // Display suggestions (for now using alert)
    alert(suggestions);

  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    alert("Sorry, something went wrong while getting suggestions.");
  }
};

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              {resumeId ? 'Edit Resume' : 'Create New Resume'}
              {isNewResume && <span className="badge bg-secondary ms-2">New</span>}
            </h2>
          </div>
          {saved && <Alert variant="success" className="mt-3">Resume saved successfully! Redirecting to viewer...</Alert>}
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Accordion defaultActiveKey="0" alwaysOpen>
            {/* Personal Information */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>Personal Information</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={resumeData.personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      placeholder="John Doe"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={resumeData.personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="john.doe@example.com"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      placeholder="(123) 456-7890"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      value={resumeData.personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      placeholder="123 Main St, City, State"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      name="linkedin"
                      value={resumeData.personalInfo.linkedin}
                      onChange={handlePersonalInfoChange}
                      placeholder="linkedin.com/in/username"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Portfolio</Form.Label>
                    <Form.Control
                      name="portfolio"
                      value={resumeData.personalInfo.portfolio}
                      onChange={handlePersonalInfoChange}
                      placeholder="yourportfolio.com"
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* Education */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>Education</Accordion.Header>
              <Accordion.Body>
                {resumeData.education.map((edu, index) => (
                  <Card key={edu.id} className="mb-3">
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Label>School/University</Form.Label>
                          <Form.Control
                            value={edu.school}
                            onChange={(e) => handleEducationChange(edu.id, "school", e.target.value)}
                            placeholder="University of Example"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Degree</Form.Label>
                          <Form.Control
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                            placeholder="Bachelor of Science"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Field of Study</Form.Label>
                          <Form.Control
                            value={edu.field}
                            onChange={(e) => handleEducationChange(edu.id, "field", e.target.value)}
                            placeholder="Computer Science"
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => handleEducationChange(edu.id, "startDate", e.target.value)}
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => handleEducationChange(edu.id, "endDate", e.target.value)}
                          />
                        </Col>
                        <Col md={12}>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={edu.description}
                            onChange={(e) => handleEducationChange(edu.id, "description", e.target.value)}
                            placeholder="Relevant coursework, achievements, GPA, etc."
                          />
                        </Col>
                        <Col md={12}>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                          >
                            Remove Education
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Button variant="outline-primary" onClick={addEducation}>
                  + Add Education
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            {/* Experience */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>Work Experience</Accordion.Header>
              <Accordion.Body>
                {resumeData.experience.map((exp, index) => (
                  <Card key={exp.id} className="mb-3">
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                            placeholder="Company Name"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Position</Form.Label>
                          <Form.Control
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(exp.id, "position", e.target.value)}
                            placeholder="Job Title"
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)}
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)}
                            placeholder="Present if current"
                          />
                        </Col>
                        <Col md={12}>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                            placeholder="Responsibilities, achievements, skills used, etc."
                          />
                        </Col>
                        <Col md={12}>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                          >
                            Remove Experience
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Button variant="outline-primary" onClick={addExperience}>
                  + Add Experience
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            {/* Skills */}
            <Accordion.Item eventKey="3">
              <Accordion.Header>Skills</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Label>Add Skill</Form.Label>
                    <Form.Control
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="Enter a skill (e.g., JavaScript, Python, Photoshop)"
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="primary" onClick={addSkill}>
                      Add Skill
                    </Button>
                  </Col>
                  <Col md={12}>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {resumeData.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary d-flex align-items-center p-2">
                          {skill}
                          <button 
                            type="button" 
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: '0.5rem' }}
                            onClick={() => removeSkill(index)}
                            aria-label="Remove"
                          />
                        </span>
                      ))}
                    </div>
                    {resumeData.skills.length === 0 && (
                      <p className="text-muted mt-2">No skills added yet. Add your technical and soft skills.</p>
                    )}
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="text-center mt-4">
            <Button variant="success" size="lg" onClick={handleSave}>
              Save Resume & View
            </Button>
            <Button 
              variant="info" 
              size="lg" 
              style={{ marginLeft: "50px" }} 
              onClick={handleAISuggestions}
            >
              AI Suggestions
              </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}