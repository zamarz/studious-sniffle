const {
  getUsers,
  searchUsers,
} = require("../db/controllers/users-controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", searchUsers);

module.exports = usersRouter;
