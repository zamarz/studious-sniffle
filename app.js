const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticles,
} = require("./db/controllers/news-controllers");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles", getArticles);

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
