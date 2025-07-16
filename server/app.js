const express = require("express");
const cors = require("cors");
const getInspiration = require("./controllers/getInspiration");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/inspiration/:date", (req, res, next) => {
  getInspiration(req, res, next);
});

app.use(handlePSQLErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

module.exports = app