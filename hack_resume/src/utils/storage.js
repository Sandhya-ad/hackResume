export const saveResume = (resume) => {
    try {
      const savedResumes = getResumes();
      const existingIndex = savedResumes.findIndex(r => r.id === resume.id);
      
      if (existingIndex >= 0) {
        savedResumes[existingIndex] = resume;
      } else {
        savedResumes.push(resume);
      }
      
      localStorage.setItem('savedResumes', JSON.stringify(savedResumes));
      return true;
    } catch (error) {
      console.error('Error saving resume:', error);
      return false;
    }
  };
  
  export const getResumes = () => {
    try {
      return JSON.parse(localStorage.getItem('savedResumes') || '[]');
    } catch (error) {
      console.error('Error loading resumes:', error);
      return [];
    }
  };
  
  export const getResumeById = (id) => {
    const resumes = getResumes();
    return resumes.find(r => r.id === id);
  };
  
  export const deleteResume = (id) => {
    try {
      const savedResumes = getResumes();
      const updatedResumes = savedResumes.filter(r => r.id !== id);
      localStorage.setItem('savedResumes', JSON.stringify(updatedResumes));
  
      // If the deleted resume was the master, clear it
      const master = getMasterResume();
      if (master && master.id === id) {
        localStorage.removeItem('masterResume');
      }
  
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      return false;
    }
  };  

  // Get the master resume
export const getMasterResume = () => {
    try {
      return JSON.parse(localStorage.getItem('masterResume') || 'null');
    } catch (error) {
      console.error('Error loading master resume:', error);
      return null;
    }
  };
  
  // Save the master resume
  export const saveMasterResume = (resume) => {
    try {
      localStorage.setItem('masterResume', JSON.stringify(resume));
      return true;
    } catch (error) {
      console.error('Error saving master resume:', error);
      return false;
    }
  };
  
  // Set a resume as the master template
  export const setAsMaster = (resumeId) => {
    const resume = getResumeById(resumeId);
    if (resume) {
      return saveMasterResume(resume);
    }
    return false;
  };
  