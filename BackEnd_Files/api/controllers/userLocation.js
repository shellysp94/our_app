const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

getUserLocation = (req, res) => {
  infoLogger.info("This is an info log");
  user_id = req.params.userid;

  mySqlConnection.query(
    `SELECT* from user_location where user_id = ${user_id}`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error("User Location - GET a user location. MySQL Error");
        } else {
          if (rows.length === 0) {
            res.send(`User ${user_id} doesn't have a location`);
          } else {
            res.send(rows[0]);
          }
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send("Internal Error");
      }
    }
  );
};

insertUserLocation = (req, res) => {
  infoLogger.info("This is an info log");
  const user_id = req.params.userid;
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;

  mySqlConnection.query(
    `insert into user_location (user_id, longitude, latitude) values (${user_id}, ${longitude}, ${latitude})
            on duplicate key update user_id = ${user_id}, longitude = ${longitude}, latitude = ${latitude}`,
    (err, rows) => {
      try {
        if (err || rows === undefined || rows.affectedRows < 1) {
          throw new Error(
            "User Location - POST (or UPDATE) a user's location in DB. MySQL Error"
          );
        } else {
          res.send(`Location updated for user ${user_id}`);
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send("Internal Error");
      }
    }
  );
};

deleteUserLocation = (req, res) => {
  infoLogger.info("This is an info log");
  user_id = req.params.userid;

  mySqlConnection.query(
    `DELETE from user_location where user_id=${user_id}`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "User Location - DELETE a user location, MySQL Error"
          );
        } else {
          res.send(`Location of user ${user_id} deleted`);
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send("Internal Error");
      }
    }
  );
};

module.exports = {
  getUserLocation,
  insertUserLocation,
  deleteUserLocation,
};
