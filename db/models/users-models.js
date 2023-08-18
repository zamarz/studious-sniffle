const db = require("../connection");
const endpoints = require("../../endpoints.json");

const selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
};

const findUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return result.rows[0];
      }
    });
};

module.exports = { selectUsers, findUser };
