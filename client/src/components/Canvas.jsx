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

  const downloadFile = () => {
    console.log("Lines pre upload --> ", lines);
    const myData = lines;
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

  //delete last element with the client's socket_id in the local lines
  //Emit request to delete the last input with the user's socket id
  //delete this element from the server-side storage
  //emit a request to delete this item from other user's storage

  const [redoBuffer, setRedoBuffer] = useState([]);

  const handleUndo = (e) => {
    // const holdingVar = [];
    const newArr = [...lines];
    console.log(newArr);
    for (let i = lines.length - 1; i >= 0; i--) {
      if (
        lines[i].socketIdRef.current === socketIdRef.current &&
        newArr[i].points.length > 2
      ) {
        // holdingVar.unshift(lines[i]);

        newArr[i].points = [0, 0];

        console.log(newArr);

        break;
      }
    }
    // setRedoBuffer(holdingVar);
    // console.log(redoBuffer);
    setLines(newArr);
    console.log(lines);

    socket.emit("requestUndo", { canvas_id, socketIdRef });
  };

  // const handleReceivedUndo = (data) => {
  //   const newArr = [...lines];

  //   for (let i = lines.length - 1; i >= 0; i--) {
  //     if (
  //       lines[i].socketIdRef.current === data.current &&
  //       newArr[i].points.length > 2
  //     ) {
  //       newArr[i].points = [0, 0];

  //       console.log(newArr);

  //       return;
  //     }
  //   }
  //   // setLines(newArr);

  //   // setLines((prev) => {

  //   // })
  // };

  // const handleReceivedUndo = (data) => {
  //   // const newArr = [...lines];
  //   setLines((prev) => {
  //     const newArr = [...prev];
  //     for (let i = prev.length - 1; i >= 0; i--) {
  //       if (
  //         prev[i].socketIdRef.current === data.current &&
  //         newArr[i].points.length > 2
  //       ) {
  //         newArr[i].points = [0, 0];

  //         console.log(newArr);

  //         return;
  //       }
  //     }
  //     // setLines(newArr);
  //     return newArr;
  //   });
  // };

  const handleRedo = (e) => {};

  useEffect(() => {
    socket.on("initial-canvas", (linesHistory) => {
      setLines(linesHistory);
      console.log(lines);
    });

    socket.on("live-users", (currUsers) => {
      setLiveUsers(currUsers);
    });

    socket.on("drawing", (newLine) => {
      // console.log(newLine.socketIdRef.current);
      if (newLine.socketIdRef.current !== socketIdRef.current) {
        setLines((previous) => [...previous, newLine]);
      }
    });

    socket.on("undoCommand", (data) => {
      handleReceivedUndo(data.socketIdRef);
      // console.log(data.socketIdRef);
    });

    // socket.on("undoCommand", (data) => {
    //   const newArr = [...lines];
    //   console.log(lines);
    //   for (let i = lines.length - 1; i >= 0; i--) {
    //     if (
    //       lines[i].socketIdRef === data.socketIdRef &&
    //       newArr[i].points.length > 2
    //     ) {
    //       newArr[i].points = [0, 0];

    //       console.log(newArr);

    //       break;
    //     }
    //   }

    //   console.log(newArr);
    //   setLines(newArr);
    // });

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

    setLiveLine({
      ...liveLine,
      points: [...liveLine.points, pos.x, pos.y],
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;

    if (liveLine && liveLine.points.length > 0) {
      // console.log(liveLine);
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
        <button onClick={downloadFile}>Download Editable</button>
        <input type="file" onChange={setCanvasWithFile} />
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>

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
