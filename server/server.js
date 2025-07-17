const { createServer } = require("node:http");
const { Server } = require("socket.io");
const app = require("./app");

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://tusemain.netlify.app",
    ],
  },
});

const liveUsers = new Set();

const knownRooms = ["1234-abcd", "5678-abcd", "7890-abcd"]; // temp room for test purposes
const knownCanvases = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("createRoomRequest", (roomId) => {
    if (!roomExists(roomId)) {
      knownRooms.push(roomId);
    }
    if (!(roomId in knownCanvases)) {
      knownCanvases[roomId] = { lines: [], rectangles: [] };
    }
    socket.join(roomId);
    socket.emit("roomJoined", roomId);
    socket.emit("initial-canvas", knownCanvases[roomId]);
  });

  socket.on("joinRoomRequest", (roomId) => {
    console.log("User connected to ", roomId, "Known rooms: ", knownRooms);
    if (roomExists(roomId)) {
      if (!(roomId in knownCanvases)) {
        knownCanvases[roomId] = { lines: [], rectangles: [] };
      }
      socket.join(roomId);
      socket.emit("roomJoined", roomId);

      socket.emit("initial-canvas", knownCanvases[roomId]);
    } else {
      socket.emit("roomJoinError", "Room ID not recognised");
    }
  });

  function roomExists(roomId) {
    return knownRooms.includes(roomId);
  }

  socket.on("get-initial-canvas", (roomId) => {
    socket.emit("initial-canvas", knownCanvases[roomId]);
  });

  liveUsers.add(socket.id);

  socket.on("drawing", (data) => {
    if (!data || !data.canvas_id || !roomExists(data.canvas_id)) return;
    knownCanvases[data.canvas_id].lines.push(data);
    io.to(data.canvas_id).emit("drawing", data);
  });

  socket.on("drawing-rectangle", (rectangleData) => {
    knownCanvases[rectangleData.canvas_id].rectangles.push(rectangleData);
    io.to(rectangleData.canvas_id).emit("drawing-rectangle", rectangleData);
  });

  socket.on("requestUndo", (data) => {
    //gets canvas_id, socketIdRef and the last used tool (string)

    if (data.lastTool !== "rectangle") {
      for (
        let i = knownCanvases[data.canvas_id].lines.length - 1;
        i >= 0;
        i--
      ) {
        if (
          knownCanvases[data.canvas_id].lines[i].socketIdRef.current ===
            data.socketIdRef.current &&
          knownCanvases[data.canvas_id].lines[i].points.length > 2
        ) {
          knownCanvases[data.canvas_id].lines[i].points = [0, 0];
          break;
        }
      }
    } else {
      // console.log(knownCanvases[data.canvas_id].rectangles);
      for (
        // let i = knownCanvases[data.canvas_id]{/* LINES OR RECTANGLES*/ }.length - 1;
        let i = knownCanvases[data.canvas_id].rectangles.length - 1;
        i >= 0;
        i--
      ) {
        console.log(knownCanvases[data.canvas_id].rectangles[i].socketIdRef);
        console.log(data.socketIdRef.current);
        if (
          knownCanvases[data.canvas_id].rectangles[i].socketIdRef ===
            data.socketIdRef.current &&
          knownCanvases[data.canvas_id].rectangles[i].width !== 0 &&
          knownCanvases[data.canvas_id].rectangles[i].height !== 0
        ) {
          console.log("rectangle NOT 0,0");
          knownCanvases[data.canvas_id].rectangles[i].width = 0;
          knownCanvases[data.canvas_id].rectangles[i].height = 0;

          break;
        }
      }
    }

    io.emit("initial-canvas", knownCanvases[data.canvas_id]);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    liveUsers.delete(socket.id);
    io.emit("live-users", Array.from(liveUsers));
  });

  io.emit("live-users", Array.from(liveUsers));
});

const PORT = process.env.PORT || 5174;
server.listen(PORT, () => console.log(`server listening on ${PORT}`));
