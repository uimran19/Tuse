import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import { socket } from "../socket";
import Toolbar from "./Toolbar";
import { useParams } from "react-router-dom";

const Canvas = () => {
  const { canvas_id } = useParams();
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);
  const [liveLine, setLiveLine] = React.useState(null);
  const isDrawing = React.useRef(false);
  const [storedCanvas, setStoredCanvas] = React.useState(null);
  let socketIdRef = useRef("");
  const [liveUsers, setLiveUsers] = React.useState([]);
  const stageRef = useRef(null);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [colour, setColour] = useState("#000000");

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLiveLine({
      canvas_id,
      tool,
      points: [pos.x, pos.y],
      socketIdRef,
      strokeWidth,
      colour,
    });
  };

  useEffect(() => {
    socket.on("initial-canvas", (linesHistory) => {
      setLines(linesHistory);
    });

    socket.on("live-users", (currUsers) => {
      setLiveUsers(currUsers);
    });

    socket.on("test message received", (testMsg) => {
      console.log(testMsg);
    });

    // socket.on("drawing", (linesHistory) => {
    //   setLines(linesHistory);
    // });

    socket.on("drawing", (newLine) => {
      setLines((previous) => [...previous, newLine]);
    });

    socket.on("connect", () => {
      socketIdRef.current = socket.id;
      socket.emit("joinRoomRequest", canvas_id);
      socket.emit("get-initial-canvas", canvas_id); //conditional on handshake
    });

    socket.on("roomJoined", (roomId) => {
      console.log(`room joined OK: ${roomId}`);
    });

    socket.on("roomJoinError", (err) => {
      console.log(err);
    });

    return () => {
      socket.off("connect");
      socket.off("live-users");
      socket.off("test message received");
      socket.off("drawing");
      socket.off("initial-canvas");
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setLiveLine({
      ...liveLine,
      points: [...liveLine.points, point.x, point.y],
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    socket.emit("drawing", liveLine);

    //prevents flickering of liveLine
    requestAnimationFrame(() => {
      setLiveLine(null);
    });
  };

  const handleExport = () => {
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 2, // double resolution
    });

    const link = document.createElement("a");
    link.download = "stage.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={handleExport}>Download</button>

      <Toolbar
        tool={tool}
        setTool={setTool}
        setStrokeWidth={setStrokeWidth}
        setColour={setColour}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        // onMouseOut={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        ref={stageRef}
        onClick={(e) => {
          const stage = e.target.getStage();

          //   console.log(stage);
          setStoredCanvas(stage);
        }}
      >
        <Layer>
          {lines &&
            lines.map((line, i) => (
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
          {liveLine && (
            <Line
              points={liveLine.points}
              stroke={liveLine.colour}
              strokeWidth={liveLine.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                liveLine.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
