import {
  FaPenFancy,
  FaEye,
  FaEyeSlash,
  FaPalette,
  FaSave,
  FaUndo, 
  FaRedo, 
} from "react-icons/fa";
import { FaPencil, FaRegSquareFull } from "react-icons/fa6";
import { BsEraserFill } from "react-icons/bs";
import { useState } from "react";
import BrushButton from "./BrushButton";
import styled from "styled-components";
import { subTitleFont } from "./classes";

const toolbarShadowStyling = () => {
  const shadowScaling = `var(--button-scale) * var(--shadow-scale)`;

  return `
    & .not-active, & .toolbarSplit {
      box-shadow: rgba(0, 0, 0, 0.17) 0px calc(-4.6px * ${shadowScaling})
          calc(5px * ${shadowScaling}) 0px inset,
        rgba(0, 0, 0, 0.15) 0px calc(-7px * ${shadowScaling})
          calc(6px * ${shadowScaling}) 0px inset,
        rgba(0, 0, 0, 0.1) 0px calc(-16px * ${shadowScaling})
          calc(8px * ${shadowScaling}) 0px inset,
        rgba(0, 0, 0, 0.06) 0px calc(0.5px * ${shadowScaling})
          calc(0.5px * ${shadowScaling}),
        rgba(0, 0, 0, 0.09) 0px calc(1px * ${shadowScaling})
          calc(0.5px * ${shadowScaling}),
        rgba(0, 0, 0, 0.09) 0px calc(1.6px * ${shadowScaling})
          calc(1px * ${shadowScaling}),
        rgba(0, 0, 0, 0.09) 0px calc(3px * ${shadowScaling})
          calc(1.6px * ${shadowScaling}),
        rgba(0, 0, 0, 0.09) 0px calc(6px * ${shadowScaling})
          calc(3px * ${shadowScaling});
    }
  
    & .active {
      box-shadow: rgba(0, 0, 0, 0.17) 0px calc(4.6px * ${shadowScaling})
          calc(5px * ${shadowScaling}) 0px inset,
        rgba(0, 0, 0, 0.15) 0px calc(7px * ${shadowScaling})
          calc(6px * ${shadowScaling}) 0px inset,
        rgba(0, 0, 0, 0.1) 0px calc(16px * ${shadowScaling})
          calc(8px * ${shadowScaling}) 0px inset,
        rgba(0, 0, 0, 0.06) 0px calc(0.5px * ${shadowScaling})
          calc(0.5px * ${shadowScaling}),
        rgba(0, 0, 0, 0.09) 0px calc(1px * ${shadowScaling})
          calc(0.5px * ${shadowScaling}) inset,
        rgba(0, 0, 0, 0.09) 0px calc(1.6px * ${shadowScaling})
          calc(1px * ${shadowScaling}) inset;
    }
  `;
};

const StyledToolbar = styled.section`
  --button-scale: 1.5;
  position: fixed;
  z-index: 10;
  top: calc(var(--header-height) + 0.5rem);
  left: 50vw;
  transform: translate(-50%);
  max-width: 95vw;
  width: max-content;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  border: none;
  border-radius: 0.5rem;
  padding: 0 0.25rem;
  background-color: transparent;
  color: var(--text-color-dark);
  pointer-events: none;

  & * {
    pointer-events: auto;
  }

  & button {
    --shadow-scale: 1;
    margin: 0.5rem;
    padding: 0.5rem;
    background-color: white;
    border: none;
    border-radius: calc(1rem * var(--button-scale));
    min-height: calc(2rem * var(--button-scale));
    min-width: calc(2rem * var(--button-scale));
    box-sizing: border-box;
    ${subTitleFont}
    font-size: calc(0.65rem * var(--button-scale));
    color: inherit;
  }

  ${toolbarShadowStyling}

  & .toolbarSplit {
    --shadow-scale: 0.5;
    --height: calc(1rem * var(--button-scale));
    height: var(--height);
    aspect-ratio: 1/1;
    background-color: white;
    color: transparent;
    margin: 0 0.5rem;
    margin-top: calc(
      calc(2rem * var(--button-scale) - var(--height)) * 0.5 + 0.5rem
    );
    border-radius: calc(0.5rem * var(--button-scale));
    pointer-events: none;
  }
`;

const StyledDropdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem;
  font-size: small;

  & button {
    margin: 0.25rem 0;
    padding: 0;
    min-height: 0;
    font-size: inherit;

    &:hover {
      color: blue;
    }
  }

  & #load-file {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 12rem;
    border: 1px solid black;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.17) 0 0 2px 3px inset;
    margin-top: 0.5rem;
  }

  & #colour-palette {
    padding: 0;
    border: none;
    height: calc(2rem * var(--button-scale));
  }

  & .paletteNonColourOptions {
    display: grid;
    grid-template-columns: auto auto 2.5rem;
    grid-template-rows: auto;

    & label {
      grid-column: 1 / span 1;
    }

    & input {
      grid-column: 2 / span 1;
    }
    

    & span {
      grid-column: 3 / span 1;
    }
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
  handleExport,
  downloadFile,
  setCanvasWithFile,
  inspirationExists,
  showInspiration,
  setShowInspiration,
  handleUndo,
  handleRedo,
}) {
  const [showPalette, setShowPalette] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [currentColour, setCurrentColour] = useState("#000000");

  function handleToolClick(e) {
    if (e.target.value === "pencil") {
        setColour("grey");
        setCurrentColour("grey")
    }
    else if (e.target.value === "pen") {
      setColour("#000000");
      setCurrentColour("#000000");
    }
    else if (e.target.value === "rectangle") {
        setColour("#000000");
        setCurrentColour("#000000")
    }
    setTool(e.currentTarget.value);
  }

  function togglePalette() {
    setShowPalette(!showPalette);
  }

  function toggleFileMenu() {
    setShowFileMenu(!showFileMenu);
  }

  function handleColorChange(e) {
    setCurrentColour(e.target.value);
    if (tool === "pen" || tool === "brush" || tool === "rectangle") setColour(e.target.value);
  }

  function handleStrokeWidth(e) {
    setStrokeWidth(Number(e.target.value));
  }

  function handleOpacity(e) {
    setOpacity(Number(e.target.value));
  }

  function toggleShowInspiration() {
    setShowInspiration(!showInspiration);
  }

  return (
    <StyledToolbar>
      <button onClick={handleUndo} className="not-active">
        <FaUndo />
      </button>
      <button onClick={handleRedo} className="not-active">
        <FaRedo />
      </button>
      <span className="toolbarSplit"></span>

      <button
        value={"pencil"}
        onClick={handleToolClick}
        className={tool === "pencil" ? "active" : "not-active"}
      >
        <FaPencil />
      </button>
      <button
        value={"pen"}
        onClick={handleToolClick}
        className={tool === "pen" ? "active" : "not-active"}
      >
        <FaPenFancy />
      </button>
      <BrushButton
        onClick={handleToolClick}
        tool={tool}
        value={"brush"}
        className={tool === "brush" ? "active" : "not-active"}
      />
      <button
        value="rectangle"
        onClick={handleToolClick}
        className={tool === "rectangle" ? "active" : "not-active"}
      >
        <FaRegSquareFull />
      </button>
      <button
        value={"eraser"}
        onClick={handleToolClick}
        className={tool === "eraser" ? "active" : "not-active"}
      >
        <BsEraserFill />
      </button>
      <button onClick={togglePalette} className="not-active">
        <FaPalette />
        {showPalette && (
          <StyledDropdown onClick={(e) => e.stopPropagation()}>
            <input
              id="colour-palette"
              type="color"
              value={currentColour}
              onChange={handleColorChange}
            />
            <div className="paletteNonColourOptions">
              <label className="paletteLabels" htmlFor="strokeWidth">
                Width:{" "}
              </label>
              <input
                id="strokeWidth"
                type="range"
                min="1"
                value={strokeWidth}
                onChange={handleStrokeWidth}
              />
              <span className="nonPaletteValues">{strokeWidth}</span>
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
          </StyledDropdown>
        )}
      </button>
      <span className="toolbarSplit"></span>
      <button onClick={toggleFileMenu} className="not-active">
        <FaSave />
        {showFileMenu && (
          <StyledDropdown onClick={(e) => e.stopPropagation()}>
            <button onClick={handleExport}>Export</button>
            <button onClick={downloadFile}>Download</button>
            <input id="load-file" type="file" onChange={setCanvasWithFile} />
          </StyledDropdown>
        )}
      </button>
      {inspirationExists && (
        <button
          onClick={toggleShowInspiration}
          className={showInspiration ? "active" : "not-active"}
        >
          {showInspiration ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </StyledToolbar>
  );
}

export default Toolbar;
