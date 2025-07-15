const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

const getInspiration = require("./controllers/getInspiration");

const app = express();
const server = createServer(app);

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/inspiration/:date", (req, res, next) => {
  getInspiration(req, res, next);
});

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
    console.log(roomId);
    if (!roomExists(roomId)) {
      knownRooms.push(roomId);
    }
    if (!(roomId in knownCanvases)) {
      knownCanvases[roomId] = [];
    }
    socket.join(roomId);
    socket.emit("roomJoined", roomId);
    socket.emit("initial-canvas", knownCanvases[roomId]);
  });

  socket.on("joinRoomRequest", (roomId) => {
    console.log("User connected to ", roomId, "Known rooms: ", knownRooms);
    if (roomExists(roomId)) {
      if (!(roomId in knownCanvases)) {
        knownCanvases[roomId] = [];
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
    console.log(knownCanvases);
  });

  liveUsers.add(socket.id);

  socket.on("drawing", (data) => {
    if (!data || !data.canvas_id || !roomExists(data.canvas_id)) return;

    knownCanvases[data.canvas_id].push(data);
    io.to(data.canvas_id).emit("drawing", data);
  });

  socket.on("requestUndo", (data) => {
    //delete local

    for (let i = knownCanvases[data.canvas_id].length - 1; i >= 0; i--) {
      if (
        knownCanvases[data.canvas_id][i].socketIdRef.current ===
          data.socketIdRef.current &&
        knownCanvases[data.canvas_id][i].points.length > 2
      ) {
        knownCanvases[data.canvas_id][i].points = [0, 0];

        break;
      }
    }

    console.log(data);

    // io.to(data.canvas_id).emit("undoCommand", data);

    // io.to(data.canvas_id).emit("initial-canvas", knownCanvases[data.canvas_id]);

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
