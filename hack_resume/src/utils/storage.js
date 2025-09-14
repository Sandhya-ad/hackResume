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
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      return false;
    }
  };