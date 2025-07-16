import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import { socket } from "../socket";
import Toolbar from "./Toolbar";
import { useParams, Link } from "react-router-dom";
import { BsDisplay } from "react-icons/bs";
import BrushStrokes from "./BrushStrokes";

const Canvas = () => {
  let params = useParams();
  let canvas_id = params.canvas_id.toLowerCase();
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);
  const [liveLine, setLiveLine] = React.useState(null);
  const isDrawing = React.useRef(false);
  let socketIdRef = useRef("");
  const [liveUsers, setLiveUsers] = React.useState([]);
  const stageRef = useRef(null);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [colour, setColour] = useState("#000000");
  const [isValidRoom, setIsValidRoom] = useState(true);
  const [rectangles, setRectangles] = useState([]);
  const [currentRect, setCurrentRect] = useState(null);

  const canvasWidth = 2000;
  const canvasHeight = 1200;

  Konva.dragButtons = [1];

  const downloadFile = () => {
    console.log("Lines pre upload --> ", lines);

    const myData = { lines, rectangles };

    console.log(myData);
    const fileName = "MyDrawing";
    const json = JSON.stringify(myData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const setCanvasWithFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");

    fileReader.onload = (e) => {
      try {
        const newData = JSON.parse(e.target.result);

        if (
          !newData ||
          !Array.isArray(newData.lines) ||
          !Array.isArray(newData.rectangles)
        ) {
          alert(
            "Invalid file format. File must contain 'lines' and 'rectangles' arrays"
          );
          return;
        }

        const newLines = newData.lines;
        const newRectangles = newData.rectangles;
        console.log("newestLines--> ", newLines);
        console.log("newestRectangles--> ", newRectangles);
        const newestLines = newLines.map((line) => {
          const newestLine = { ...line };
          newestLine.canvas_id = canvas_id;
          newestLine.socketIdRef = socketIdRef;
          return newestLine;
        });

        const newestRectangles = newRectangles.map((rectangle) => {
          const newestRectangle = { ...rectangle };
          newestRectangle.canvas_id = canvas_id;
          newestRectangle.socketIdRef = socketIdRef;
          return newestRectangle;
        });

        setLines(newestLines);
        setRectangles(newestRectangles);
      } catch (err) {
        console.log("Invalid JSON: ", err);
        alert(
          "JSON file invalid. Please try again after checking the file contents."
        );
      }
    };
  };

  const handleMouseDown = (e) => {
    setRedoBuffer([]);
    const stage = stageRef.current;

    if (e.evt.button === 1) {
      isDrawing.current = false;
      return;
    }

    if (e.evt.button !== 1) {
      isDrawing.current = true;
      const pointer = stage.getPointerPosition();
      const pos = {
        x: (pointer.x - stage.x()) / stage.scaleX(),
        y: (pointer.y - stage.y()) / stage.scaleY(),
      };

      const clampX = Math.max(0, Math.min(canvasWidth, pos.x));
      const clampY = Math.max(0, Math.min(canvasHeight, pos.y));

      if (tool === "rectangle") {
        setCurrentRect({
          canvas_id,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          // fill: 'black',
          stroke: colour,
          colour,
          strokeWidth,
          opacity,
          tool: "rectangle",
        });
      }
      setLiveLine({
        canvas_id,
        tool,
        points: [clampX, clampY],
        socketIdRef,
        strokeWidth,
        colour,
        opacity,
      });
    }
  };

  const handleTouchStart = (e) => {
    const stage = stageRef.current;
    stage.draggable(false);
    const touches = e.evt.touches;

    if (touches.length > 1) {
      stage.draggable(true);
      isDrawing.current = false;
    } else {
      e.evt.preventDefault();
      isDrawing.current = true;
      const pointer = stage.getPointerPosition();
      const pos = {
        x: (pointer.x - stage.x()) / stage.scaleX(),
        y: (pointer.y - stage.y()) / stage.scaleY(),
      };

      if (tool === "rectangle") {
        setCurrentRect({
          canvas_id,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          // fill: 'black',
          stroke: colour,
          colour,
          strokeWidth,
          opacity,
          tool: "rectangle",
        });
      }

      setLiveLine({
        canvas_id,
        tool,
        points: [pos.x, pos.y],
        socketIdRef,
        strokeWidth,
        colour,
      });
    }
  };

  const lastCenter = useRef(null);
  const lastDist = useRef(0);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState({ x: 1, y: 1 });

  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const getCenter = (p1, p2) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  };

  const handleTouchMove = (e) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();
    const touches = e.evt.touches;

    if (touches.length === 1 && isDrawing.current === true) {
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();

      const pos = {
        x: (pointer.x - stage.x()) / stage.scaleX(),
        y: (pointer.y - stage.y()) / stage.scaleY(),
      };

      if (tool === "rectangle" && currentRect) {
        const width = pos.x - currentRect.x;
        const height = pos.y - currentRect.y;

        setCurrentRect({
          ...currentRect,
          width,
          height,
        });
        return;
      }

      setLiveLine({
        ...liveLine,
        points: [...liveLine.points, pos.x, pos.y],
      });

      return;
    } else {
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const stage = e.target.getStage();

      if (!touch1 || !touch2) return;

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };
      const newCenter = getCenter(p1, p2);
      const dist = getDistance(p1, p2);

      if (!lastCenter.current) {
        lastCenter.current = newCenter;
        return;
      }

      if (!lastDist.current) {
        lastDist.current = dist;
        return;
      }
      const scale = dist / lastDist.current;
      const newScale = stageScale.x * scale;

      const pointTo = {
        x: (newCenter.x - stagePos.x) / stageScale.x,
        y: (newCenter.y - stagePos.y) / stageScale.x,
      };

      const dx = newCenter.x - lastCenter.current.x;
      const dy = newCenter.y - lastCenter.current.y;

      setStageScale({ x: newScale, y: newScale });

      setStagePos({
        x: newCenter.x - pointTo.x * newScale + dx,
        y: newCenter.y - pointTo.y * newScale + dy,
      });

      lastCenter.current = newCenter;
      lastDist.current = dist;
    }
  };

  const handleWheelScroll = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;

    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const scaleBy = 1.2;
    let newScale = direction < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const minScaleX = stage.width() / canvasWidth;
    const minScaleY = stage.height() / canvasHeight;

    const minScale = Math.max(minScaleX, minScaleY);
    newScale = Math.max(newScale, minScale);

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const pos = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    if (tool === "rectangle" && currentRect) {
      const width = pos.x - currentRect.x;
      const height = pos.y - currentRect.y;

      setCurrentRect({
        ...currentRect,
        width,
        height,
      });
      return;
    }

    setLiveLine({
      ...liveLine,
      points: [...liveLine.points, pos.x, pos.y],
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;

    lastCenter.current = null;
    lastDist.current = 0;

    if (tool === "rectangle" && currentRect) {
      const finalizedRect = {
        ...currentRect,
        canvas_id,
        socketIdRef: socketIdRef.current,
      };

      setRectangles((prev) => [...prev, finalizedRect]);
      socket.emit("drawing-rectangle", finalizedRect);
      setCurrentRect(null);
      return;
    }

    if (liveLine && liveLine.points.length > 0) {
      socket.emit("drawing", liveLine);
      setLines((prevLines) => [...prevLines, liveLine]);
    }
    requestAnimationFrame(() => {
      setLiveLine(null);
    });
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      stage.scale(stageScale);
      stage.position(stagePos);
      stage.batchDraw();
    }
  }, [stageScale, stagePos]);

  const [redoBuffer, setRedoBuffer] = useState([]);

  const handleUndo = (e) => {
    let lastUndo = [];
    const newArr = [...lines];

    for (let i = lines.length - 1; i >= 0; i--) {
      if (
        lines[i].socketIdRef.current === socketIdRef.current &&
        newArr[i].points.length > 2
      ) {
        lastUndo = newArr[i];
        setRedoBuffer((prevBuffers) => [lastUndo, ...prevBuffers]);
        break;
      }
    }

    console.log(redoBuffer);

    setLines(newArr);

    socket.emit("requestUndo", { canvas_id, socketIdRef });
  };

  const handleRedo = (e) => {
    console.log(redoBuffer);
    if (redoBuffer.length > 0) {
      const liveBuffer = [...redoBuffer];
      setLines((prevLines) => [...prevLines, liveBuffer[0]]);
      setRedoBuffer(liveBuffer.slice(1));
      socket.emit("drawing", liveBuffer[0]);
    }
  };

  const [undoActivated, setUndoActivate] = useState(false);

  useEffect(() => {
    if (socket.connected) {
      socketIdRef.current = socket.id;
      socket.emit("joinRoomRequest", canvas_id);
      socket.emit("get-initial-canvas", canvas_id);
    }

    socket.on("initial-canvas", (canvasHistory) => {
      setLines(canvasHistory.lines);
      setRectangles(canvasHistory.rectangles);
    });

    socket.on("live-users", (currUsers) => {
      setLiveUsers(currUsers);
    });

    socket.on("drawing", (newLine) => {
      if (newLine.socketIdRef.current !== socketIdRef.current) {
        setLines((previous) => [...previous, newLine]);
      }
    });

    socket.on("drawing-rectangle", (newRect) => {
      if (newRect.socketIdRef !== socketIdRef.current) {
        setRectangles((prev) => [...prev, newRect]);
      }
    });

    socket.on("undoCommand", (data) => {
      handleReceivedUndo(data.socketIdRef);
    });

    socket.on("roomJoined", (roomId) => {
      console.log(`room joined OK: ${roomId}`);
    });

    socket.on("connect", () => {
      socketIdRef.current = socket.id;
      socket.emit("joinRoomRequest", canvas_id);
      socket.emit("get-initial-canvas", canvas_id);
    });

    socket.on("connect-error", () => {
      console.log("connection error");
      socket.connect();
    });

    socket.on("roomJoinError", (err) => {
      console.log(err);
      setIsValidRoom(false);
    });

    return () => {
      socket.off("initial-canvas");
      socket.off("live-users");
      socket.off("drawing");
      socket.off("drawing-rectangle");

      socket.off("undoCommand");
      socket.off("roomJoined");
      socket.off("connect");
      socket.off("connect-error");
      socket.off("roomJoinError");
      socket.off("test message received");
    };
  }, [canvas_id]);

  const handleExport = () => {
    const dataURL = stageRef.current.toDataURL({
      x: 0,
      y: 0,

      width: 2000,
      height: 1200,
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = "myDrawing.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isValidRoom)
    return (
      <div
        style={{
          backgroundColor: "#edebdd",
          width: "100vw",
          height: "95vh",
        }}
      >
        <Toolbar
          tool={tool}
          setTool={setTool}
          setStrokeWidth={setStrokeWidth}
          strokeWidth={strokeWidth}
          setColour={setColour}
          opacity={opacity}
          setOpacity={setOpacity}
          handleExport={handleExport}
          downloadFile={downloadFile}
          setCanvasWithFile={setCanvasWithFile}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
        />

        <div
          style={{
            display: "flex",
            flex: "1",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stage
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheelScroll}
            ref={stageRef}
            draggable
            dragBoundFunc={(pos) => {
              const scale = stageRef.current.scale();
              const stage = stageRef.current;

              const canvasScaledWidth = canvasWidth * scale.x;
              const canvasScaledHeight = canvasHeight * scale.y;

              const minX = stage.width() - canvasScaledWidth;
              const maxX = 0;

              const minY = stage.height() - canvasScaledHeight;
              const maxY = 0;
              return {
                x: Math.max(minX, Math.min(maxX, pos.x)),
                y: Math.max(minY, Math.min(maxY, pos.y)),
              };
            }}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={2000}
                height={1200}
                fill="white"
                listening={false}
              ></Rect>
              {lines &&
                lines.map((line, i) => {
                  if (line.tool !== "brush") {
                    return (
                      <Line
                        key={i}
                        points={line.points}
                        stroke={line.colour}
                        strokeWidth={line.strokeWidth}
                        opacity={line.tool === "eraser" ? 1 : line.opacity}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={
                          line.tool === "eraser"
                            ? "destination-out"
                            : "source-over"
                        }
                      />
                    );
                  }
                })}
              {liveLine && (
                <Line
                  points={liveLine.points}
                  stroke={liveLine.colour}
                  strokeWidth={liveLine.strokeWidth}
                  opacity={
                    liveLine.tool === "eraser"
                      ? 1
                      : liveLine.tool === "brush"
                      ? 0
                      : liveLine.opacity
                  }
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    liveLine.tool === "eraser"
                      ? "destination-out"
                      : "source-over"
                  }
                />
              )}
              {rectangles &&
                rectangles.map((rect, i) => (
                  <Rect
                    key={`rect-${i}`}
                    // colour={rect.colour}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    // fill={rect.fill}
                    stroke={rect.colour}
                    strokeWidth={rect.strokeWidth}
                    opacity={rect.opacity}
                  />
                ))}

              {currentRect && currentRect && (
                <Rect
                  x={currentRect.x}
                  y={currentRect.y}
                  width={currentRect.width}
                  height={currentRect.height}
                  fill={currentRect.fill}
                  stroke={currentRect.stroke}
                  strokeWidth={currentRect.strokeWidth}
                  opacity={currentRect.opacity}
                  // dash={[4, 2]}
                />
              )}
              <BrushStrokes lines={lines} liveLine={liveLine} />
            </Layer>
          </Stage>
        </div>
      </div>
    );
  else
    return (
      <>
        <div>Room not found!</div>
        <Link to={`/home`}>Return home</Link>;
      </>
    );
};

export default Canvas;
