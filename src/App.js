import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Menu />} />
        <Route path="/:id" element={<Menu />} />
      </Routes>
    </Router>
  );
}
export default App;
