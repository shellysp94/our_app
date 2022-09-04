const { Logform, Logger } = require("winston");
const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const logger = require("../../utils/logger");

module.exports = {
  getAllUsers: (req, res) => {
    logger.info("This is an info log");
    mySqlConnection.query("SELECT* from Users", (err, rows) => {
      try {
        res.send(rows);
      } catch {
        console.log(err);
      }
    });
  },

  getOneUser: (req, res) => {
    logger.info("This is an info log");
    const arr = req.params.userid.split(",");
    mySqlConnection.query(
      "SELECT * from Users WHERE user_id IN (?)",
      [arr],
      (err, rows) => {
        try {
          res.send(rows);
        } catch {
          //console.log(err);
          logger.error("This is an err log");
        }
      }
    );
  },

  deleteUser: (req, res) => {
    logger.info("This is an info log");
    mySqlConnection.query(
      "DELETE FROM Users WHERE user_id=?",
      req.params.userid,
      (err, rows) => {
        try {
          if (rows.affectedRows >= 1) {
            res.send("user deleted successfully");
          } else {
            res.status(500).send("Can't delete row");
          }
        } catch (err) {
          //console.log(err);
          logger.error("this is error", { err });
        }
      }
    );
  },
  updateUser: (req, res) => {
    logger.info("This is an info log");
    let user_id = req.params.userid;
    let email = req.body.email;

    let hashedPassword = bcrypt.hash(req.body.password, 10);

    mySqlConnection.query(
      "UPDATE Users SET email=?, password=? WHERE user_id=?",
      [email, hashedPassword, user_id],
      (err, result) => {
        try {
          res.send("user updated successfully");
        } catch {
          console.log(err);
        }
      }
    );
  },
};
