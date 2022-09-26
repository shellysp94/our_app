const {
  insertUserLocation,
  updateUserLocation,
} = require("../../api/controllers/userLocation");
const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

function updateLocation(onlineUsers, message, ws) {
  const user_id = onlineUsers.getUserIdAccordingToWebSocket(ws);

  if (user_id != -1) {
    const longitude = String(message).split(",")[0];
    const latitude = String(message).split(",")[1];
    let resultArrayToObject = {
      params: {
        userid: parseInt(user_id),
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      },
    };

    mySqlConnection.query(
      `SELECT* from user_location where user_id = ${user_id}`,
      (err, rows) => {
        try {
          if (rows.length > 0) {
            updateUserLocation(resultArrayToObject, (msg) => {
              console.log(msg);
            });
          } else {
            insertUserLocation(resultArrayToObject, (msg) => {
              console.log(msg);
            });
          }
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  } else {
    console.log("invalid user id");
  }
}

module.exports = { updateLocation: updateLocation };
