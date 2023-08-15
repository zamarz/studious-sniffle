const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticles,
  getComments,
  searchArticle,
} = require("./db/controllers/news-controllers");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", searchArticle);

app.get("/api/articles/:article_id/comments", getComments);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
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
