import './App.css';
import {Routes, Route, Navigate, Navigation} from "react-router-dom";
import Home from "./pages/Home";
function App() {
  return (
      <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      </>
  );
}

export default App;
