const {
  patchComment,
  deleteComment,
} = require("../db/controllers/comments-controllers");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteComment);

commentsRouter.patch("/:comment_id", patchComment);

module.exports = commentsRouter;
