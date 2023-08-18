const { deleteComment } = require("../db/controllers/news-controllers");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
