const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, request, response, next) => {
  if (err.code === "22P02" || err.code === "42703") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "23503") {
    response.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});
app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "error!" });
});

module.exports = app;
