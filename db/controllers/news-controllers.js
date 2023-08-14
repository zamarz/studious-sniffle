const { selectTopics, selectArticles } = require("../models/news-models");
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

const getArticles = (request, response) => {
  selectArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

module.exports = { getTopics, getEndpoints, getArticles };
