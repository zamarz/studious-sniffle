const {
  selectTopics,
  findArticle,
  findComments,
  checkArticleID,
  selectArticles,
  patchArticle,
  checkTopic,
  insertComment,
  checkCommentID,
  removeComment,
} = require("../models/news-models.js");
const endpoints = require("../../endpoints.json");

const getTopics = (request, response, next) => {
  const { slug } = request.query;
  selectTopics(slug)
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getEndpoints = (request, response) => {
  return response.status(200).send({ endpoints });
};

const getArticles = (request, response, next) => {
  const { order_by, sort_by, topic } = request.query;

  const promises = [selectArticles(order_by, sort_by, topic)];

  if (topic) {
    promises.push(checkTopic(topic));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
      if (articles.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      } else {
        response.status(200).send({ articles });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const searchArticle = (request, response, next) => {
  const { article_id } = request.params;
  findArticle(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getComments = (request, response, next) => {
  const { article_id } = request.params;

  const promises = [findComments(article_id)];

  if (article_id) {
    promises.push(checkArticleID(article_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      response.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

const patchVote = (request, response, next) => {
  const { inc_votes } = request.body;

  const { article_id } = request.params;

  const promises = [patchArticle(inc_votes, article_id)];

  if (article_id) {
    promises.push(checkArticleID(article_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const article = resolvedPromises[0];
      response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (request, response, next) => {
  const { article_id } = request.params;
  const { author, body } = request.body;

  const promises = [insertComment(author, body, article_id)];

  if (article_id) {
    promises.push(checkArticleID(article_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const newComment = resolvedPromises[0];
      response.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};

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

module.exports = {
  getTopics,
  getEndpoints,
  getArticles,
  getComments,
  searchArticle,
  patchVote,
  postComment,
  deleteComment,
};
