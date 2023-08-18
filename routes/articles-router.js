const {
  getArticles,
  searchArticle,
  getComments,
  patchVote,
  postComment,
  postArticle,
} = require("../db/controllers/news-controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.route("/:article_id").get(searchArticle).patch(patchVote);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
