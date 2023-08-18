const db = require("../connection");
const endpoints = require("../../endpoints.json");
const { articleData } = require("../data/test-data");

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
    .query(
      `SELECT *, COUNT(comment_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id, comments.comment_id;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return result.rows[0];
      }
    });
};

//  `SELECT *, COUNT(comment_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE comments.article_id = $1 GROUP BY articles.article_id, comments.comment_id;

//SELECT *, COUNT(comments.comment_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = 1 GROUP BY articles.article_id, comments.comment_id;

// `SELECT *, COUNT(comment_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id, comments.comment_id;`,

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

const selectArticles = (
  order_by = "desc",
  sort_by = "created_at",
  topic = null
) => {
  const acceptedOrders = ["desc", "asc"];
  const acceptedSorts = [
    "created_at",
    "author",
    "title",
    "topic",
    "votes",
    "article_id",
    "article_img_url",
  ];
  const queryValues = [];

  if (!acceptedOrders.includes(order_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!acceptedSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let baseSqlString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id `;

  if (topic) {
    baseSqlString += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  baseSqlString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by};`;

  return db.query(baseSqlString, queryValues).then((result) => {
    return result.rows;
  });
};

const checkTopic = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

const patchArticle = (inc_votes, article_id) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + ${inc_votes} WHERE article_id = $1 RETURNING *;`,
      [article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const insertComment = (author, body, article_id) => {
  if (!author || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `INSERT INTO comments(author, body, article_id)
  VALUES ($1, $2, $3) RETURNING *;`,
      [author, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const removeComment = (comment_id) => {
  if (!comment_id) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then((result) => {
      return result.rows[0];
    });
};

const checkCommentID = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

module.exports = {
  selectTopics,
  findArticle,
  findComments,
  checkArticleID,
  selectArticles,
  patchArticle,
  insertComment,
  checkTopic,
  removeComment,
  checkCommentID,
};
