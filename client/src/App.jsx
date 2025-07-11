import { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas" element={<Canvas />}></Route>
      </Routes>
    </>
  );
}

export default App;
