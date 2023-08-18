const {
  updateComment,
  removeComment,
  checkCommentID,
} = require("../models/comments-models");

const deleteComment = (request, response, next) => {
  const { comment_id } = request.params;

  const promises = [removeComment(comment_id)];

  if (comment_id) {
    promises.push(checkCommentID(comment_id));
  }

  Promise.all(promises)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const patchComment = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;

  const promises = [updateComment(inc_votes, comment_id)];

  if (comment_id) {
    promises.push(checkCommentID(comment_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comment = resolvedPromises[0];
      response.status(200).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { patchComment, deleteComment };
