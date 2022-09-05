const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

getUserLocation = (req, res) => {
  infoLogger.info("This is an info log");
  user_id = req.params.userid;
  mySqlConnection.query(
    `SELECT* from user_location where user_id=${user_id}`,
    (err, rows) => {
      try {
        res.send(rows[0]);
      } catch (err) {
        console.log(err.message);
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
        res.send(`Location updated for user ${user_id}`);
      } catch (err) {
        console.log(err.message);
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
        res.send(`location of user ${user_id} deleted`);
      } catch (err) {
        console.log(err.message);
      }
    }
  );
};

module.exports = {
  getUserLocation,
  insertUserLocation,
  deleteUserLocation,
};

//cb for WS
// insertUserLocation: (req,cb) =>
// {
//     const user_id=req.params.userid;
//     const longitude = req.params.longitude;
//     const latitude = req.params.latitude;
//     mySqlConnection.query(`INSERT INTO user_location (user_id, longitude, latitude) values (?,?,?)`,[user_id,longitude,latitude], (err,rows) =>
//     {
//         try
//         {
//             cb(`Location added for user ${user_id}`);
//         }

//         catch(err)
//         {
//             console.log(err.message);
//         }
//     });
// },

//cb for WS
// updateUserLocation: (req,cb) =>
// {
//     const user_id=req.params.userid;
//     const longitude = req.params.longitude;
//     const latitude = req.params.latitude;

//     mySqlConnection.query(`UPDATE user_location SET longitude=?, latitude=? where user_id=?`,[longitude,latitude,user_id], (err,rows) =>
//     {
//         try
//         {
//             cb(`Location updated for user ${user_id}`);
//         }

//         catch(err)
//         {
//             console.log(err.message);
//         }
//     });
// },
