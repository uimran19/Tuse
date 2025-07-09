const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
