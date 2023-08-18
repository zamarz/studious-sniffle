const db = require("../connection");

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

const updateComment = (inc_votes, comment_id) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `UPDATE comments SET votes = votes + ${inc_votes} WHERE comment_id = $1 RETURNING *;`,
      [comment_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { updateComment, removeComment, checkCommentID };
