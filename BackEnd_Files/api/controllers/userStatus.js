const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

getUserStatus = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;

  mySqlConnection.query(
    `select * from user_status where user_id = ${userid}`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error("User Status - GET request MySQL Error");
        } else {
          res.send(rows);
        }
      } catch (err) {
        errLogger.error("User Status - GET MySQL Error", { err });
        return res.status(500).send("internal error");
      }
    }
  );
};

updateUserStatus = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;
  const status = req.body.status;

  try {
    if (status === undefined) {
      throw new Error("User Status - POST MySQL syntax Error");
    }

    mySqlConnection.query(
      `insert into user_status (user_id, status_last_update, user_status) values (${userid}, current_timestamp(), "${status}") 
      on duplicate key update user_id = ${userid}, status_last_update = current_timestamp(), user_status = "${status}"`,
      (err, rows) => {
        try {
          if (err || rows === undefined || rows.affectedRows < 1) {
            throw new Error("User Status - POST request MySQL Error");
          }

          getUserStatus(req, res);
        } catch (err) {
          errLogger.error(`${err}`);
          return res.status(500).send("internal error");
        }
      }
    );
  } catch (err) {
    errLogger.error(`${err}`);
    return res.status(500).send("internal error");
  }
};

module.exports = {
  getUserStatus,
  updateUserStatus,
};
