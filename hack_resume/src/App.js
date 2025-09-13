import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard";
import Applications from "./components/Applications";
import NewApplication from "./components/NewApplication";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/new" element={<NewApplication />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
