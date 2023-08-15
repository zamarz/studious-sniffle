const {
  selectTopics,
  findArticle,
  findComments,
  checkArticleID,
} = require("../models/news-models");
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

const getArticle = (request, response, next) => {
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

module.exports = { getTopics, getEndpoints, getArticle, getComments };
