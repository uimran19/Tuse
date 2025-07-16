import { BsEraserFill } from "react-icons/bs";
import { FaRegSquareFull } from "react-icons/fa6";
import { useState } from "react";
import BrushButton from "./BrushButton";
import styled from "styled-components";

const StyledToolbar = styled.section`
  --button-scale: 1.5;
  position: fixed;
  top: calc(var(--header-height) + 0.5rem);
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: none;
  border-radius: 0.5rem;
  padding: 0 0.25rem;
  background-color: transparent;

  & button {
    margin: 0.5rem;
    padding: 0.5rem;
    background-color: white;
    border: none;
    border-radius: calc(0.75rem * var(--button-scale));
    height: calc(2rem * var(--button-scale));
    min-width: calc(2rem * var(--button-scale));
    box-sizing: border-box;
    font-size: calc(0.65rem * var(--button-scale));
    box-shadow: rgba(0, 0, 0, 0.17) 0px calc(-4.6px * var(--button-scale))
        calc(5px * var(--button-scale)) 0px inset,
      rgba(0, 0, 0, 0.15) 0px calc(-7px * var(--button-scale))
        calc(6px * var(--button-scale)) 0px inset,
      rgba(0, 0, 0, 0.1) 0px calc(-16px * var(--button-scale))
        calc(8px * var(--button-scale)) 0px inset,
      rgba(0, 0, 0, 0.06) 0px calc(0.5px * var(--button-scale))
        calc(0.5px * var(--button-scale)),
      rgba(0, 0, 0, 0.09) 0px calc(1px * var(--button-scale))
        calc(0.5px * var(--button-scale)),
      rgba(0, 0, 0, 0.09) 0px calc(1.6px * var(--button-scale))
        calc(1px * var(--button-scale)),
      rgba(0, 0, 0, 0.09) 0px calc(3px * var(--button-scale))
        calc(1.6px * var(--button-scale)),
      rgba(0, 0, 0, 0.09) 0px calc(6px * var(--button-scale))
        calc(3px * var(--button-scale));
  }

  & .active {
    box-shadow: rgba(0, 0, 0, 0.17) 0px calc(4.6px * var(--button-scale))
        calc(5px * var(--button-scale)) 0px inset,
      rgba(0, 0, 0, 0.15) 0px calc(7px * var(--button-scale))
        calc(6px * var(--button-scale)) 0px inset,
      rgba(0, 0, 0, 0.1) 0px calc(16px * var(--button-scale))
        calc(8px * var(--button-scale)) 0px inset,
      rgba(0, 0, 0, 0.06) 0px calc(0.5px * var(--button-scale))
        calc(0.5px * var(--button-scale)),
      rgba(0, 0, 0, 0.09) 0px calc(1px * var(--button-scale))
        calc(0.5px * var(--button-scale)) inset,
      rgba(0, 0, 0, 0.09) 0px calc(1.6px * var(--button-scale))
        calc(1px * var(--button-scale)) inset;
  }
`;

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
    if (tool === "pen" || tool === "brush") setColour(e.target.value);
  }

  function handleStrokeWidth(e) {
    setStrokeWidth(Number(e.target.value));
  }

  function handleOpacity(e) {
    setOpacity(Number(e.target.value));
  }

  return (
    <StyledToolbar id="toolbad" className="toolbar">
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
      <BrushButton onClick={handleToolClick} tool={tool} value={"brush"} />
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
      {/* <span className="toolbarSplit">|</span> */}
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
    </StyledToolbar>
  );
}

export default Toolbar;
