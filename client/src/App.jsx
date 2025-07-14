import { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/canvas/:canvas_id" element={<Canvas />}></Route>

        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
