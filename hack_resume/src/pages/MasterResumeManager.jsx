import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Alert, Badge } from "react-bootstrap";
import { getResumes, getMasterResume, setAsMaster, saveMasterResume } from "../utils/storage";

const MasterResumeManager = ({ show, onHide, onMasterSelected }) => {
  const [resumes, setResumes] = useState([]);
  const [currentMaster, setCurrentMaster] = useState(null);

  useEffect(() => {
    loadResumes();
  }, [show]);

  const loadResumes = () => {
    const savedResumes = getResumes();
    setResumes(savedResumes);
    setCurrentMaster(getMasterResume());
  };

  const handleSetMaster = (resume) => {
    if (setAsMaster(resume.id)) {
      setCurrentMaster(resume);
      alert(`"${resume.title}" set as master resume!`);
    }
  };

  const handleCreateFromMaster = () => {
    if (currentMaster && onMasterSelected) {
      onMasterSelected(currentMaster);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Master Resume Management</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentMaster ? (
          <Alert variant="info">
            <strong>Current Master Resume:</strong> {currentMaster.title}
          </Alert>
        ) : (
          <Alert variant="warning">
            No master resume set. Select a resume to use as your master template.
          </Alert>
        )}
        
        <h5>Your Resumes</h5>
        <ListGroup>
          {resumes.map((resume) => (
            <ListGroup.Item 
              key={resume.id} 
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                {resume.title}
                {currentMaster && currentMaster.id === resume.id && (
                  <Badge bg="success" className="ms-2">Master</Badge>
                )}
              </div>
              <Button 
                size="sm" 
                variant="outline-primary"
                onClick={() => handleSetMaster(resume)}
                disabled={currentMaster && currentMaster.id === resume.id}
              >
                {currentMaster && currentMaster.id === resume.id ? 'Current Master' : 'Set as Master'}
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleCreateFromMaster}
          disabled={!currentMaster}
        >
          Create from Master
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MasterResumeManager;