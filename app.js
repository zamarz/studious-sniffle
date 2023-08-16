const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticles,
  getComments,
  searchArticle,
  postComment,
} = require("./db/controllers/news-controllers");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", searchArticle);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
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
