import './App.css';
import {Routes, Route, Navigate, Navigation} from "react-router-dom";
import Home from "./pages/Home";
import Applications from './components/Applications';
import ResumeBuilder from "./pages/ResumeBuilder";
import MyResumes from "./pages/MyResumes"
import Login from './pages/login';

export default function App() { 
  return (
      <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/login" element={<Login />} />
        {/* optional placeholder for later */}
        <Route path="/tailor" element={<div style={{padding:20}}>Tailor Resume coming soon…</div>} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/my-resumes" element={<MyResumes />} />
      </Routes>
      </>
  );
}
