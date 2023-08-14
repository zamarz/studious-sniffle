const selectTopics = require("../models/news-models");

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

module.exports = getTopics;
