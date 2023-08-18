const { getUsers } = require("../db/controllers/news-controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;
