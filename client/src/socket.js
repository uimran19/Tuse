import { io } from "socket.io-client";
const URL =
  process.env.NODE_ENV === "production"
    ? "https://socket-canvas-testing.onrender.com"
    : "http://localhost:5174";

export const socket = io(URL);
