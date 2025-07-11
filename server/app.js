const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/todays-inspiration", (req, res, next) => {
  getTodaysInspiration(req, res, next);
});

module.exports = app;
