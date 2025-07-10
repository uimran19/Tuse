import { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/canvas" element={<Canvas />}></Route>
      </Routes>
    </>
  );
}

export default App;
