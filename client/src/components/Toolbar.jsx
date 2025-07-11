import { BsEraserFill } from "react-icons/bs";
import { useState } from "react";

function Toolbar({ tool, setTool, setStrokeWidth, setColour }) {
  const [showPalette, setShowPalette] = useState(false);
  const [currentColour, setCurrentColour] = useState("#000000");

  function handleToolClick(e) {
    if (e.target.value === "pencil") setColour("grey");
    else if (e.target.value === "pen") {
      setColour("#000000");
      setCurrentColour("#000000");
    }
    setTool(e.currentTarget.value);
  }

  function togglePalette() {
    setShowPalette(!showPalette);
  }

  function handleColorChange(e) {
    setCurrentColour(e.target.value);
    if (tool === "pen") setColour(e.target.value);
  }

  return (
    <section id="toolbad" className="toolbar">
      <button
        value={"pencil"}
        onClick={handleToolClick}
        className={tool === "pencil" ? "active" : ""}
      >
        ✏️
      </button>
      <button
        value={"pen"}
        onClick={handleToolClick}
        className={tool === "pen" ? "active" : ""}
      >
        🖊️
      </button>
      <button
        value={"eraser"}
        onClick={handleToolClick}
        className={tool === "eraser" ? "active" : ""}
      >
        <BsEraserFill />
      </button>
      <span>|</span>
      <button onClick={togglePalette}>🎨</button>
      {showPalette && (
        <div className="paletteDropdown">
          <input
            type="color"
            value={currentColour}
            onChange={handleColorChange}
          />
          <label htmlFor="strokeWidth">tool size</label>
          <input id="strokeWidth" type="text" />
        </div>
      )}
    </section>
  );
}

export default Toolbar;
