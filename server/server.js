import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "https://alternative-socket-testing.netlify.app",
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const liveUsers = new Set();
const linesHistory = [];

const knownRooms = ["123XYZ", "123ABC", "123DEF"]; // temp room for test purposes
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
  });

  liveUsers.add(socket.id);

  socket.on("test-socket", (testMsg) => {
    io.emit("test message received", testMsg + "<-- server response");

    console.log("Server response: " + testMsg);
  });

  socket.on("drawing", (data) => {
    if (!data) return;

    knownCanvases[data.canvas_id].push(data);
    io.to(data.canvas_id).emit("drawing", data);
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
