const db = require("../connection");
const endpoints = require("../../endpoints.json");

const selectTopics = (slug = null) => {
  const queryValues = [];

  let baseSqlString = `SELECT * FROM topics `;

  if (slug) {
    baseSqlString += `WHERE slug = $1;`;
    queryValues.push(slug);
  }

  return db.query(baseSqlString, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource not found" });
    } else {
      return result.rows;
    }
  });
};

const findArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return result.rows[0];
      }
    });
};

const findComments = (article_id, sort_by = "created_at", order = "desc") => {
  const acceptedSorts = ["created_at"];
  const acceptedOrders = ["asc", "desc"];
  const queryValues = [];

  if (!acceptedSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!acceptedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let baseSqlString = `SELECT * FROM comments WHERE article_id = $1 `;

  baseSqlString += `ORDER BY ${sort_by} ${order};`;

  return db.query(baseSqlString, [article_id]).then((result) => {
    // if (result.rows.length === 0) {
    //   return Promise.reject({ status: 404, msg: "Not found" });
    // } else {
    return result.rows;
    // }
  });
};

const checkArticleID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

const selectArticles = (order_by = "desc") => {
  const acceptedOrders = ["desc", "asc"];

  if (!acceptedOrders.includes(order_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count FROM articles
      JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id ORDER BY created_at ${order_by};`
    )
    .then((result) => {
      return result.rows;
    });
};

module.exports = {
  selectTopics,
  findArticle,
  findComments,
  checkArticleID,
  selectArticles,
};