const apiRouter = require("express").Router();
const { getEndpoints } = require("../db/controllers/news-controllers");

const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
