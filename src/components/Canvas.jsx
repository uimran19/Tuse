import { useState, useRef } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import Toolbar from "./Toolbar";
import UndoRedo from "./UndoRedo";

function Canvas() {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [colour, setColour] = useState('#000000')

    const history = useRef([[]]);
  const historyStep = useRef(0);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y], strokeWidth, colour}]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

    const handleUndo = () => {
    if (historyStep.current === 0) {
      return;
    }
    historyStep.current -= 1;
    const previous = history.current[historyStep.current];
    setPosition(previous);
  };

  const handleRedo = () => {
    if (historyStep.current === history.current.length - 1) {
      return;
    }
    historyStep.current += 1;
    const next = history.current[historyStep.current];
    setPosition(next);
  };

  return (
    <>
        <Toolbar
        tool={tool}
        setTool={setTool}
        setStrokeWidth={setStrokeWidth}
        setColour={setColour}
        />
        <UndoRedo />
        <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        >
        <Layer>
            {lines.map((line, i) => (
            <Line
                key={i}
                points={line.points}
                stroke={line.colour}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
                }
            />
            ))}
        </Layer>
        </Stage>
    </>
  );
}

export default Canvas;
