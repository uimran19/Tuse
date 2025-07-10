import { useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/canvas/:canvas_id" element={<Canvas />}></Route>
        {/* This is temporary */}
        <Route path="/canvas" element={<Canvas />}></Route>
      </Routes>
    </>
  );
}

export default App;
