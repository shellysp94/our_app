const dbConfig = require("../../config/db_config");
//const users = require("./users");
const mySqlConnection = dbConfig;

module.exports = {
  getAllNotifications: (req, res) => {
    mySqlConnection.query("SELECT * from Notifications", (err, rows) => {
      try {
        res.send(rows);
      } catch (err) {
        console.log(err.message);
      }
    });
  },

  getUserNotifications: (req, res) => {
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

  getAllNotificationsSendingFrom: (req, res) => {
    const userid = req.params.userid;
    mySqlConnection.query(
      "select * from Notifications where sent_from = ?",
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

  createUserNotification: (req, res) => {
    const userid = req.params.userid;
    const content = req.body.content;
    const sentFrom = req.params.sentFrom;
    const currentDate = new Date();
    mySqlConnection.query(
      "INSERT INTO Notifications (user_id, content, sent_from, creation_date) values (?, ?, ?, ?)",
      [userid, content, sentFrom, currentDate],
      (err, result) => {
        try {
          msgToClient = {msg: `Notification for user ${userid} added successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  },

  updateSeenStatusNotification: (req, res) => {
    let update = "seen";
    const notificationID = req.params.notificationID;
    const seen = req.params.seen;
    mySqlConnection.query(
      "UPDATE Notifications SET seen = ? WHERE notification_id = ?",
      [seen, notificationID],
      (err, result) => {
        try {
          if (seen === "0") {
            update = "unseen";
          }
          msgToClient = {msg: `Notification number ${notificationID} update to ${update} successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  },

  deleteUserSeenNotifications: (req, res) => {
    const userid = req.params.userid;
    mySqlConnection.query(
      "DELETE FROM Notifications WHERE user_id = ? and seen = 1",
      [userid],
      (err, result) => {
        try {
          msgToClient = {msg: `All user ${userid} seen notifications deleted successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  },
};