const { Logform, Logger } = require("winston");
const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

getAllUsers = (req, res) => {
  logger.info("This is an info log");

  mySqlConnection.query("SELECT* from Users", (err, rows) => {
    try {
      if (err || rows === undefined) {
        throw new Error(
          "Users - GET request. Get all users in DB, MySQL Error"
        );
      } else {
        res.send(rows);
      }
    } catch (err) {
      logger.error({ err });
      return res.status(500).send(`Internal Error`);
    }
  });
};

getOneUser = (req, res) => {
  logger.info("This is an info log");
  const arr = req.params.userid.split(",");

  mySqlConnection.query(
    `select * from Users where user_id in (${arr})`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Users - GET request. Get a users from the DB, MySQL Error"
          );
        } else {
          res.send(rows);
        }
      } catch (err) {
        logger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

deleteUser = (req, res) => {
  logger.info("This is an info log");

  mySqlConnection.query(
    `delete from Users  where user_id = ${req.params.userid}`,
    // "DELETE FROM Users WHERE user_id=?",
    // req.params.userid,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error("Users - DELETE a user from DB, MySQL Error");
        } else {
          res.send("user deleted successfully");
        }
      } catch (err) {
        logger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

updateUser = (req, res) => {
  logger.info("This is an info log");
  let user_id = req.params.userid;
  let email = req.body.email;

  let hashedPassword = bcrypt.hash(req.body.password, 10);

  mySqlConnection.query(
    `update Users set email = "${email}", password = "${hashedPassword}" where user_id = ${user_id}`,
    // "UPDATE Users SET email=?, password=? WHERE user_id=?",
    // [email, hashedPassword, user_id],
    (err, rows) => {
      try {
        if (err || rows === undefined || rows.affectedRows < 1) {
          throw new Error("Users - UPDATE (PUT) a user, MySQL Error");
        } else {
          res.send("user updated successfully");
        }
      } catch {
        logger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

module.exports = {
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
};
