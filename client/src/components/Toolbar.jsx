import { BsEraserFill } from "react-icons/bs";
import { FaRegSquareFull } from "react-icons/fa6";
import { useState } from "react";
import BrushButton from "./BrushButton";
import styled from "styled-components";

const toolbarShadowStyling = (scaling) => {
  const shadowScaling = `var(--button-scale) * ${scaling}`;

  return `
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
  }`;
};

const StyledToolbar = styled.section`
  --button-scale: 1.5;
  position: fixed;
  z-index: 10;
  top: calc(var(--header-height) + 0.5rem);
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  border: none;
  border-radius: 0.5rem;
  padding: 0 0.25rem;
  background-color: transparent;
  color: var(--text-color-dark);

  & button {
    margin: 0.5rem;
    padding: 0.5rem;
    background-color: white;
    border: none;
    border-radius: calc(0.75rem * var(--button-scale));
    min-height: calc(2rem * var(--button-scale));
    min-width: calc(2rem * var(--button-scale));
    box-sizing: border-box;
    font-size: calc(0.65rem * var(--button-scale));
    color: inherit;
  }

  & .not-active {
    ${toolbarShadowStyling(1)}
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

  & .toolbarSplit {
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
    ${toolbarShadowStyling(0.5)}
  }
`;

const StyledDropdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0.5rem 0.5rem;

  & #colour-palette {
    padding: 0;
    border: none;
    height: calc(2rem * var(--button-scale));
    border-radius: calc(1rem * var(--button-scale));
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
}) {
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
    if (tool === "pen" || tool === "brush") setColour(e.target.value);
  }

  function handleStrokeWidth(e) {
    setStrokeWidth(Number(e.target.value));
  }

  function handleOpacity(e) {
    setOpacity(Number(e.target.value));
  }

  return (
    <StyledToolbar>
      <button
        value={"pencil"}
        onClick={handleToolClick}
        className={tool === "pencil" ? "active" : "not-active"}
      >
        ✏️
      </button>
      <button
        value={"pen"}
        onClick={handleToolClick}
        className={tool === "pen" ? "active" : "not-active"}
      >
        🖊️
      </button>
      <BrushButton onClick={handleToolClick} tool={tool} value={"brush"} />
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
      <span className="toolbarSplit">|</span>
      <button onClick={togglePalette} className="not-active">
        🎨
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
    </StyledToolbar>
  );
}

export default Toolbar;
