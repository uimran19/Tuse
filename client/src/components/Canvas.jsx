import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import { socket } from "../socket";
import Toolbar from "./Toolbar";
import { useParams, Link } from "react-router-dom";
import { BsDisplay } from "react-icons/bs";

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

  Konva.dragButtons = [1];

  const handleMouseDown = (e) => {
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
      if (tool === "rectangle") {
        setCurrentRect({
          canvas_id,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          // fill: 'black',
          stroke: "black",
          strokeWidth,
          opacity,
          tool: "rectangle",
        });
        return;
      }
      setLiveLine({
        canvas_id,
        tool,
        points: [pos.x, pos.y],
        socketIdRef,
        strokeWidth,
        colour,
        opacity,
      });
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
    const newScale = direction < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
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

  const handleTouchMove = (e) => {
    e.evt.preventDefault();

    if (isDrawing.current === true) {
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();

      const pos = {
        x: (pointer.x - stage.x()) / stage.scaleX(),
        y: (pointer.y - stage.y()) / stage.scaleY(),
      };

      setLiveLine({
        ...liveLine,
        points: [...liveLine.points, pos.x, pos.y],
      });
    }
  };

  // const h

  useEffect(() => {
    if (socket.connected) {
      socketIdRef.current = socket.id;
      socket.emit("joinRoomRequest", canvas_id);
      socket.emit("get-initial-canvas", canvas_id);
    }
    socket.on("initial-canvas", (canvasData) => {
      setLines(canvasData.lines);
      setRectangles(canvasData.rectangles);
      console.log(canvasData);
    });

    socket.on("live-users", (currUsers) => {
      setLiveUsers(currUsers);
    });

    socket.on("drawing", (newLine) => {
      console.log(newLine.socketIdRef.current);
      if (newLine.socketIdRef.current !== socketIdRef.current) {
        setLines((previous) => [...previous, newLine]);
      }
    });

    socket.on("drawing-rectangle", (newRect) => {
      if (newRect.socketIdRef !== socketIdRef.current) {
        setRectangles((prev) => [...prev, newRect]);
      }
    });

    socket.on("connect", () => {
      socketIdRef.current = socket.id;
      socket.emit("joinRoomRequest", canvas_id);
      socket.emit("get-initial-canvas", canvas_id);
    });

    socket.on("roomJoined", (roomId) => {
      console.log(`room joined OK: ${roomId}`);
    });

    socket.on("roomJoinError", (err) => {
      console.log(err);
      setIsValidRoom(false);
    });

    return () => {
      socket.off("connect");
      socket.off("live-users");
      socket.off("test message received");
      socket.off("drawing");
      socket.off("drawing-rectangle");
      socket.off("initial-canvas");
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
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
  };

  const handleMouseUp = () => {
    isDrawing.current = false;

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

  const handleExport = () => {
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = "stage.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isValidRoom)
    return (
      <div>
        <button onClick={handleExport}>Download</button>

        <Toolbar
          tool={tool}
          setTool={setTool}
          setStrokeWidth={setStrokeWidth}
          strokeWidth={strokeWidth}
          setColour={setColour}
          opacity={opacity}
          setOpacity={setOpacity}
        />
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheelScroll}
          ref={stageRef}
          draggable
        >
          <Layer>
            {lines &&
              lines.map((line, i) => (
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
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            {liveLine && (
              <Line
                points={liveLine.points}
                stroke={liveLine.colour}
                strokeWidth={liveLine.strokeWidth}
                opacity={liveLine.tool === "eraser" ? 1 : liveLine.opacity}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  liveLine.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            )}
            {rectangles.map((rect, i) => (
              <Rect
                key={`rect-${i}`}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                // fill={rect.fill}
                stroke={rect.stroke}
                strokeWidth={rect.strokeWidth}
                opacity={rect.opacity}
              />
            ))}

            {currentRect && (
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
          </Layer>
        </Stage>
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
