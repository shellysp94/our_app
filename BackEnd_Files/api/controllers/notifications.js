const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

getAllNotifications = (req, res) => {
  infoLogger.info("This is an info log");

  mySqlConnection.query("SELECT * from Notifications", (err, rows) => {
    try {
      if (err || rows === undefined) {
        throw new Error(
          "Notifications -GET all notifications from DB, MySQL Error"
        );
      } else {
        res.send(rows);
      }
    } catch (err) {
      errLogger.error({ err });
      return res.status(500).send("Internal Error");
    }
  });
};

getUserNotifications = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;

  mySqlConnection.query(
    `select * from Notifications where user_id = ${userid}`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error("Notifications - GET user's notifications");
        } else {
          res.send(rows);
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send("Internal Error");
      }
    }
  );
};

getUserUnseenNotifications = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;

  mySqlConnection.query(
    `select * from Notifications where user_id = ${userid} and seen = 0`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Notifications - GET user's **unseen** notifications"
          );
        } else {
          res.send(rows);
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send("Internal Error");
      }
    }
  );
};

updateSeenStatusNotification = (req, res) => {
  infoLogger.info("This is an info log");
  notification_id = req.params.notification_id;

  mySqlConnection.query(
    `UPDATE Notifications SET seen = 1 WHERE notification_id = "${notification_id}"`,
    (err, rows) => {
      try {
        if (err || rows === undefined || rows.affectedRows < 1) {
          throw new Error(
            "Notifications - UPDATE (PUT) seen status of a notification"
          );
        } else {
          res.send(`notification id ${notification_id} seen`);
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send("Internal Error");
      }
    }
  );
};

deleteUserSeenNotifications = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;

  mySqlConnection.query(
    `delete from Notifications where user_id = ${userid} and seen = 1`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error("Notifications - DELETE user's seen notifications");
        } else {
          res.send(
            `All user ${userid} seen notifications deleted successfully`
          );
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send("Internal Error");
      }
    }
  );
};

createUserNotification = (req, cb) => {
  infoLogger.info("This is an info log");
  sqlQuery = `insert into Notifications (notification_id, user_id, content, title, creation_date) values (${req.body.notification_id},${req.body.user_id},'${req.body.content}','${req.body.title}',CURRENT_TIMESTAMP())`;

  mySqlConnection.query(sqlQuery, (err, rows) => {
    if (err || rows || rows.affectedRows < 1) {
      return cb(`${req.body.title} sent`);
    } else {
      return cb(undefined);
    }
  });
};

module.exports = {
  getAllNotifications,
  getUserNotifications,
  getUserUnseenNotifications,
  updateSeenStatusNotification,
  deleteUserSeenNotifications,
  createUserNotification,
};
