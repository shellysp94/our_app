const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

module.exports = {
  getAllUsers: (req, res) => {
    //var message = "url: ," + req.originalUrl + " method: " + req.method;
    infoLogger.info("API request");
    mySqlConnection.query("SELECT* from Users", (err, rows) => {
      try {
        res.send(rows);
      } catch {
        console.log(err);
      }
    });
  },

  getOneUser: (req, res) => {
    infoLogger.info("This is an info log");
    const arr = req.params.userid.split(",");
    mySqlConnection.query(
      "SELECT * from Users WHERE user_id IN (?)",
      [arr],
      (err, rows) => {
        try {
          res.send(rows);
        } catch (err) {
          errLogger.error("This is an err log", err);
        }
      }
    );
  },

  deleteUser: (req, res) => {
    infoLogger.info("This is an info log");
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
          errLogger.error("this is error", { err });
        }
      }
    );
  },
  updateUser: (req, res) => {
    errLogger.info("This is an info log");
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
