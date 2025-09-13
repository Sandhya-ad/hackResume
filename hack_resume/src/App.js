// import logo from './logo.svg';
// import './App.css';
// import NotesPanel from "./NotesPanel";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <p>
//           Hello World! This is my first React app.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NotesRoute from "./NotesRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 默认主页：不影响组员打开看到的页面 */}
        <Route path="/" element={<Home />} />
        {/* 你的测试页：访问 /notes?app=1 */}
        <Route path="/notes" element={<NotesRoute />} />
      </Routes>
    </BrowserRouter>
  );
}