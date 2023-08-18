const { selectUsers, findUser } = require("../models/users-models");

const getUsers = (request, response) => {
  selectUsers().then((users) => {
    response.status(200).send({ users });
  });
};

const searchUsers = (request, response, next) => {
  const { username } = request.params;
  findUser(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers, searchUsers };
