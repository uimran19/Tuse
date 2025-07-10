import express from "express";
const app = express();
import cors from "cors";

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
