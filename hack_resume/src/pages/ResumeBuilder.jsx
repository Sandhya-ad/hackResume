import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Accordion } from "react-bootstrap";

const ResumeBuilder = ({ initialData, onSave }) => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      address: "",
      linkedin: "",
      portfolio: ""
    },
    education: [
      {
        id: Date.now(),
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: ""
      }
    ],
    experience: [
      {
        id: Date.now() + 1,
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: ""
      }
    ],
    skills: []
  });

  const [newSkill, setNewSkill] = useState("");

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
    onSave(resumeData);
  };

  return (
    <Container fluid>
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
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={resumeData.personalInfo.email}
                      onChange={handlePersonalInfoChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      value={resumeData.personalInfo.address}
                      onChange={handlePersonalInfoChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      name="linkedin"
                      value={resumeData.personalInfo.linkedin}
                      onChange={handlePersonalInfoChange}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Portfolio</Form.Label>
                    <Form.Control
                      name="portfolio"
                      value={resumeData.personalInfo.portfolio}
                      onChange={handlePersonalInfoChange}
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
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Degree</Form.Label>
                          <Form.Control
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Field of Study</Form.Label>
                          <Form.Control
                            value={edu.field}
                            onChange={(e) => handleEducationChange(edu.id, "field", e.target.value)}
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
                          />
                        </Col>
                        <Col md={12}>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Button variant="outline-primary" onClick={addEducation}>
                  Add Education
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
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Position</Form.Label>
                          <Form.Control
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(exp.id, "position", e.target.value)}
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
                          />
                        </Col>
                        <Col md={12}>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                          />
                        </Col>
                        <Col md={12}>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Button variant="outline-primary" onClick={addExperience}>
                  Add Experience
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
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="primary" onClick={addSkill}>
                      Add Skill
                    </Button>
                  </Col>
                  <Col md={12}>
                    <div className="d-flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary d-flex align-items-center">
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
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="text-center mt-4">
            <Button variant="success" size="lg" onClick={handleSave}>
              Save Resume & Download PDF
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeBuilder;