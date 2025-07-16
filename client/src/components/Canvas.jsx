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

  Konva.dragButtons = [1];

  const downloadFile = () => {
    console.log("Lines pre upload --> ", lines);
    const myData = lines;
    console.log(myData);
    const fileName = "my-file";
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
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const newLines = JSON.parse(e.target.result);
      console.log(newLines);
      const newestLines = newLines.map((line) => {
        const newestLine = { ...line };
        newestLine.canvas_id = canvas_id;
        newestLine.socketIdRef = socketIdRef;
        return newestLine;
      });
      console.log(newestLines);
      setLines(newestLines);
    };
  };

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
        setCurrentRect({});
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
    const newScale = direction < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
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

    setLiveLine({
      ...liveLine,
      points: [...liveLine.points, pos.x, pos.y],
    });
  };
  const handleMouseUp = () => {
    isDrawing.current = false;

    lastCenter.current = null;
    lastDist.current = 0;

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
    socket.on("initial-canvas", (linesHistory) => {
      setLines(linesHistory);
    });

    socket.on("live-users", (currUsers) => {
      setLiveUsers(currUsers);
    });

    socket.on("drawing", (newLine) => {
      if (newLine.socketIdRef.current !== socketIdRef.current) {
        setLines((previous) => [...previous, newLine]);
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
      socket.off("initial-canvas");
    };
  }, []);

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

  function TuseLine({ line }) {
    return (
      <Line
        points={line.points}
        stroke={line.colour}
        strokeWidth={line.strokeWidth}
        opacity={
          line.tool === "eraser" ? 1 : line.tool === "brush" ? 0 : line.opacity
        }
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={
          line.tool === "eraser" ? "destination-out" : "source-over"
        }
      />
    );
  }

  if (isValidRoom)
    return (
      <div>
        <button onClick={handleExport}>Download</button>
        <button onClick={downloadFile}>Download Editable</button>
        <input type="file" onChange={setCanvasWithFile} />

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
            <BrushStrokes lines={lines} liveLine={liveLine} />
            {lines && lines.map((line, i) => <TuseLine key={i} line={line} />)}
            {liveLine && <TuseLine line={liveLine} />}
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
