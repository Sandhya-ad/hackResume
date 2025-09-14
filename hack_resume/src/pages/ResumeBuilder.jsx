import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Accordion, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { getResumeById, saveResume } from "../utils/storage";
import { getResumeSuggestions } from "../utils/geminiApi"; // ✅ Correct import

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
      portfolio: "",
    },
    education: [],
    experience: [],
    skills: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);
  const [isNewResume, setIsNewResume] = useState(false);
  const [jobTitle, setJobTitle] = useState(""); // ✅ new state for job input

  useEffect(() => {
    if (resumeId) {
      const resume = getResumeById(resumeId);
      if (resume && resume.data) {
        setResumeData(resume.data);
      }
    } else if (initialData) {
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
        },
      }));
      setIsNewResume(true);
    } else {
      setIsNewResume(true);
    }
  }, [resumeId, initialData]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
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
          description: "",
        },
      ],
    }));
  };

  const removeEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    let resumeToSave;

    if (resumeId) {
      const existingResume = getResumeById(resumeId);
      if (!existingResume) {
        resumeToSave = {
          id: Date.now(),
          title: `${resumeData.personalInfo.name || "New"} Resume`,
          isMaster: true,
          data: resumeData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        resumeToSave = {
          ...existingResume,
          data: resumeData,
          updatedAt: new Date().toISOString(),
        };
      }
    } else {
      resumeToSave = {
        id: Date.now(),
        title: `${resumeData.personalInfo.name || "New"} Resume`,
        isMaster: true,
        data: resumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const success = saveResume(resumeToSave);

    if (success) {
      setSaved(true);
      setTimeout(() => {
        navigate("/my-resumes");
      }, 1000);
    } else {
      alert("Error saving resume. Please try again.");
    }
  };

  const handleAISuggestions = async () => {
    try {
      let resumeToSend;
      if (resumeId) {
        const storedResume = getResumeById(resumeId);
        resumeToSend = storedResume ? storedResume.data : resumeData;
      } else {
        resumeToSend = resumeData;
      }

      const suggestions = await getResumeSuggestions(resumeToSend, jobTitle);

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
              {resumeId ? "Edit Resume" : "Create New Resume"}
              {isNewResume && (
                <span className="badge bg-secondary ms-2">New</span>
              )}
            </h2>
          </div>
          {saved && (
            <Alert variant="success" className="mt-3">
              Resume saved successfully! Redirecting to viewer...
            </Alert>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <Accordion defaultActiveKey="0" alwaysOpen>
            {/* Personal Info */}
            {/* ... your existing sections unchanged ... */}
          </Accordion>

          {/* Job title input for AI */}
          <div className="mt-4">
            <Form.Label>What job are you applying for?</Form.Label>
            <Form.Control
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Data Analyst"
            />
          </div>

          <div className="text-center mt-4">
            <Button variant="success" size="lg" onClick={handleSave}>
              Save Resume & View
            </Button>
            <Button
              variant="info"
              size="lg"
              style={{ marginLeft: "50px" }}
              onClick={handleAISuggestions}
              disabled={!jobTitle.trim()} // prevent if empty
            >
              AI Suggestions
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
