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
let linesHistory = [];

//storedCanvases = {#socket.id1 : [lines],
//                  #socket.id2 : [lines]}

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("get-initial-canvas", () => {
    socket.emit("initial-canvas", linesHistory);
  });

  liveUsers.add(socket.id);

  socket.on("test-socket", (testMsg) => {
    io.emit("test message received", testMsg + "<-- server response");

    console.log("Server response: " + testMsg);
  });

  // socket.on("drawing", (data) => {
  //   linesHistory.push(data);
  //   io.emit("drawing", linesHistory);
  // });

  //try emitting just the new line (amended receptio on line 38 of the KonvaCanvas component)

  socket.on("drawing", (data) => {
    if (!data) return;
    linesHistory.push(data);
    io.emit("drawing", data);
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
