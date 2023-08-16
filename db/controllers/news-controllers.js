const {
  selectTopics,
  findArticle,
  findComments,
  checkArticleID,
  selectArticles,
  patchArticle,
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
  const { order_by } = request.query;
  selectArticles(order_by)
    .then((articles) => {
      response.status(200).send({ articles });
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

const patchVote = (request, response, err) => {
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

module.exports = {
  getTopics,
  getEndpoints,
  getArticles,
  getComments,
  searchArticle,
  patchVote,
};
