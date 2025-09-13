import './App.css';
import {Routes, Route, Navigate, Navigation} from "react-router-dom";
import Home from "./pages/Home";
import Applications from './components/Applications';

export default function App() { 
  return (
      <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        {/* optional placeholder for later */}
        <Route path="/tailor" element={<div style={{padding:20}}>Tailor Resume coming soon…</div>} />
      </Routes>
      </>
  );
}
