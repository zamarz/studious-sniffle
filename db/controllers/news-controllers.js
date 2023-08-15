const {
  selectTopics,
  selectArticles,
  findArticle,
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

module.exports = { getTopics, getEndpoints, searchArticle, getArticles };
