const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

module.exports = {
  getAllNotifications: (req, res) => {
    infoLogger.info("This is an info log");
    mySqlConnection.query("SELECT * from Notifications", (err, rows) => {
      try {
        res.send(rows);
      } catch (err) {
        console.log(err.message);
      }
    });
  },

  getUserNotifications: (req, res) => {
    infoLogger.info("This is an info log");
    const userid = req.params.userid;
    mySqlConnection.query(
      "SELECT * FROM Notifications WHERE user_id = ?",
      [userid],
      (err, rows) => {
        try {
          res.send(rows);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  },

  getUserUnseenNotifications: (req, res) => {
    infoLogger.info("This is an info log");
    const userid = req.params.userid;
    mySqlConnection.query(
      "SELECT * FROM Notifications WHERE user_id = ? and seen = 0",
      [userid],
      (err, rows) => {
        try {
          res.send(rows);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  },

  updateSeenStatusNotification: (req, res) => {
    infoLogger.info("This is an info log");
    notification_id = req.params.notification_id;
    mySqlConnection.query(
      `UPDATE notifications SET seen = 1 WHERE notification_id = ${notification_id}`,
      (err, rows) => {
        try {
          res.send(`notification id ${notification_id} seen`);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  },

  deleteUserSeenNotifications: (req, res) => {
    infoLogger.info("This is an info log");
    const userid = req.params.userid;
    mySqlConnection.query(
      "DELETE FROM Notifications WHERE user_id = ? and seen = 1",
      [userid],
      (err, result) => {
        try {
          msgToClient = {
            msg: `All user ${userid} seen notifications deleted successfully`,
          };
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  },

  createUserNotification: (req, cb) => {
    infoLogger.info("This is an info log");
    sqlQuery = `insert into Notifications (notification_id, user_id, content, title, creation_date) values (${req.body.notification_id},${req.body.user_id},'${req.body.content}','${req.body.title}',CURRENT_TIMESTAMP())`;

    mySqlConnection.query(sqlQuery, (err, rows) => {
      try {
        cb(`${req.body.title} sent`);
      } catch (err) {
        console.log(err);
      }
    });
  },
};
