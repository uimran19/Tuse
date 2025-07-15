import { BsEraserFill } from "react-icons/bs";
import { FaRegSquareFull } from "react-icons/fa6";
import { useState } from "react";

function Toolbar({
  tool,
  setTool,
  setStrokeWidth,
  strokeWidth,
  setColour,
  setOpacity,
  opacity,
}) {
  const [showPalette, setShowPalette] = useState(false);
  const [currentColour, setCurrentColour] = useState("#000000");

  function handleToolClick(e) {
    if (e.target.value === "pencil") setColour("grey");
    else if (e.target.value === "pen") {
      setColour("#000000");
      setCurrentColour("#000000");
    } // else if (e.target.value === "brush") {
    //   setStrokeWidth(0);
    // }
    setTool(e.currentTarget.value);
  }

  function togglePalette() {
    setShowPalette(!showPalette);
  }

  function handleColorChange(e) {
    setCurrentColour(e.target.value);
    if (tool === "pen") setColour(e.target.value);
  }

  function handleStrokeWidth(e) {
    setStrokeWidth(Number(e.target.value));
  }

  function handleOpacity(e) {
    setOpacity(Number(e.target.value));
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
        value={"brush"}
        onClick={handleToolClick}
        className={tool === "brush" ? "active" : ""}
      >
        brush
      </button>
      <button
        value="rectangle"
        onClick={handleToolClick}
        className={tool === "rectangle" ? "active" : ""}
      >
        <FaRegSquareFull />
      </button>
      <button
        value={"eraser"}
        onClick={handleToolClick}
        className={tool === "eraser" ? "active" : ""}
      >
        <BsEraserFill />
      </button>
      <span className="toolbarSplit">|</span>
      <button onClick={togglePalette}>🎨</button>
      {showPalette && (
        <div className="paletteDropdown">
          <input
            type="color"
            value={currentColour}
            onChange={handleColorChange}
          />
          <div className="paletteNonColourOptions">
            <label className="paletteLabels" htmlFor="strokeWidth">
              Tool size:{" "}
            </label>
            <input
              id="strokeWidth"
              type="range"
              min="1"
              value={strokeWidth}
              onChange={handleStrokeWidth}
            />
            <span className="nonPaletteValues">{strokeWidth}</span>
          </div>
          <div className="paletteOpacity">
            <label className="paletteLabels" htmlFor="opacity">
              Opacity:{" "}
            </label>
            <input
              id="opacity"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={handleOpacity}
            />
            <span className="nonPaletteValues">{opacity}</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default Toolbar;
