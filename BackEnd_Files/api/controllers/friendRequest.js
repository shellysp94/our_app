const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const { getUserConfigurationInner } = require("./userConfiguration");
const {
  sendNotificationHelper,
} = require("../../utils/notifications/notifications");
const { infoLogger, errLogger } = require("../../utils/logger");

getAllUserConnectionsByName = (req, res) => {
  infoLogger.info("This is an info log");
  const user = req.params.userid;
  const connected = req.params.connected;
  let fullName = req.params.name.split(/(\s+)/);
  let firstName, lastName;

  let sqlQuery = `select distinct user_id from user_configuration left join Connections on(user_id = user_A_id or user_id = user_B_id)
		where user_id != ${user} and`;

  if (fullName.length > 1) {
    //User try to search first name AND last name.
    firstName = fullName[0];
    lastName = fullName[2];
    sqlQuery = sqlQuery.concat(
      ` (first_name like "${firstName}%" and last_name like "${lastName}%")`
    );
  } else {
    sqlQuery = sqlQuery.concat(
      ` (first_name like "${fullName[0]}%" or last_name like "${fullName[0]}%")`
    );
  }

  if (parseInt(connected, 10) === 1) {
    sqlQuery = sqlQuery.concat(
      ` and (user_A_id = ${user} or user_B_id = ${user}) and connected = 1`
    );
  }

  mySqlConnection.query(sqlQuery, (err, rows) => {
    try {
      if (err || rows === undefined) {
        throw new Error("Friend Request - BY NAME, MySQL Error");
      } else {
        if (rows.length === 0) {
          msgToClient = {
            msg: `There are no suitable connections`,
          };
          return res.send(msgToClient);
        } else {
          let connectionsByName = [];
          for (i = 0; i < rows.length; i++) {
            connectionsByName.push(rows[i].user_id);
          }

          let resultArrayToObject = {
            params: {
              userid: String(user),
              type: String(connected),
              usersToPresent: connectionsByName,
            },
          };
          getAllUserConnectionsType(resultArrayToObject, res);
        }
      }
    } catch (err) {
      errLogger.error({ err });
      return res.status(500).send("Internal Error");
    }
  });
};

getAllUserConnectionsType = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;
  const type = req.params.type;
  const usersToPresent = req.params.usersToPresent;
  let usersConfigurations = [];
  let mergeObjects = [];

  mySqlConnection.query(
    `select user_id,'' as mutualConnections, '' as notConnected, '' as requestsUserSent, '' as requestsUserReceived, MAX(CASE 
		WHEN (user_A_id = ${userid} or user_B_id = ${userid}) and connected = 1 THEN 4
		WHEN (user_A_id != ${userid} and user_B_id != ${userid}) or (user_A_id is null and user_B_id is null) THEN 1
		WHEN user_A_id = ${userid} and connected = 0 THEN 2
		WHEN user_B_id = ${userid} and connected = 0 THEN 3
		END) as connection_type
	   from Connections 
	  right join user_configuration on(user_id = user_A_id or user_id = user_B_id)
	  group by user_id having user_id != ${userid};`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Friend Request - BY TYPE **GROUP BY query**, MySQL Error"
          );
        } else {
          for (i = 0; i < rows.length; i++) {
            switch (rows[i].connection_type) {
              case 1:
                rows[i].notConnected = 1;
                rows[i].mutualConnections = 0;
                rows[i].requestsUserSent = 0;
                rows[i].requestsUserReceived = 0;
                break;
              case 2:
                rows[i].notConnected = 0;
                rows[i].mutualConnections = 0;
                rows[i].requestsUserSent = 1;
                rows[i].requestsUserReceived = 0;
                break;
              case 3:
                rows[i].notConnected = 0;
                rows[i].mutualConnections = 0;
                rows[i].requestsUserSent = 0;
                rows[i].requestsUserReceived = 1;
                break;
              case 4:
                rows[i].notConnected = 0;
                rows[i].mutualConnections = 1;
                rows[i].requestsUserSent = 0;
                rows[i].requestsUserReceived = 0;
                break;
            }
          }

          if (parseInt(usersToPresent[0], 10) === 0) {
            // user asked for all other users
            for (user = 0; user < rows.length; user++) {
              usersConfigurations.push(rows[user].user_id);
            }
          } else {
            // user asked for a specific users
            for (user = 0; user < rows.length; user++) {
              if (usersToPresent.includes(rows[user].user_id)) {
                usersConfigurations.push(rows[user].user_id);
              }
            }
          }

          let resultArrayToObject = {
            params: { userid: String(usersConfigurations) },
          };
          getUserConfigurationInner(
            resultArrayToObject,
            userid,
            (resultFromConfiguration) => {
              try {
                if (resultFromConfiguration === undefined) {
                  throw new Error(
                    "Friend Request - BY TYPE request, get user configuration inner failed"
                  );
                }

                for (user = 0; user < resultFromConfiguration.length; user++) {
                  for (row = 0; row < rows.length; row++) {
                    if (
                      parseInt(resultFromConfiguration[user].user_id, 10) ===
                      parseInt(rows[row].user_id, 10)
                    ) {
                      if (parseInt(type, 10) === 1) {
                        // user asked for his friends/requests only
                        if (parseInt(rows[row].notConnected, 10) === 0) {
                          mergeObjects.push(
                            Object.assign(
                              {},
                              resultFromConfiguration[user],
                              rows[row]
                            )
                          );
                        }
                      } else {
                        // user asked for all users in db
                        mergeObjects.push(
                          Object.assign(
                            {},
                            resultFromConfiguration[user],
                            rows[row]
                          )
                        );
                      }
                    }
                  }
                }

                res.send(mergeObjects);
              } catch (err) {
                errLogger.error({ err });
                return res.status(500).send(`Internal Error`);
              }
            }
          );
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

getUserFriendRequestsReceived = (req, res) => {
  infoLogger.info("This is an info log");
  user_id = req.params.userid;

  mySqlConnection.query(
    `SELECT b.*
        from Connections a
        join user_configuration b
        on a.user_A_id = b.user_id
        where a.user_B_id = ${user_id} and a.connected = 0;`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Friend Request - get User Friend Requests Received, MySQL Error"
          );
        } else {
          if (rows.length > 0) {
            let usersArr = [];
            for (let i = 0; i < rows.length; i++) {
              usersArr.push(rows[i].user_id);
            }

            let resultArrayToObject = {
              params: { userid: String(usersArr) },
            };

            getUserConfigurationInner(
              resultArrayToObject,
              user_id,
              (config) => {
                try {
                  if (config === undefined) {
                    throw new Error(
                      "Friend Request - Get User Friend Requests Received. Get User Configuration Inner failed"
                    );
                  }

                  res.send(config);
                } catch (err) {
                  errLogger.error({ err });
                  return res.status(500).send(`Internal Error`);
                }
              }
            );
          } else {
            res.send(rows);
          }
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

getUserFriendRequestsSent = (req, res) => {
  infoLogger.info("This is an info log");
  user_id = req.params.userid;

  mySqlConnection.query(
    `SELECT b.*
        from Connections a
        join user_configuration b
        on a.user_B_id = b.user_id
        where a.user_A_id = ${user_id} and a.connected = 0;`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Friend Request - get User Friend Requests Sent, MySQL Error"
          );
        } else {
          if (rows.length > 0) {
            let usersArr = [];
            for (let i = 0; i < rows.length; i++) {
              usersArr.push(rows[i].user_id);
            }

            let resultArrayToObject = {
              params: { userid: String(usersArr) },
            };

            getUserConfigurationInner(
              resultArrayToObject,
              user_id,
              (config) => {
                try {
                  if (config === undefined) {
                    throw new Error(
                      "Friend Request - Get User Friend Requests Sent. Get User Configuration Inner failed"
                    );
                  }

                  res.send(config);
                } catch (err) {
                  errLogger.error({ err });
                  return res.status(500).send(`Internal Error`);
                }
              }
            );
          } else {
            res.send(rows);
          }
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

sendFriendRequest = async (req, res) => {
  infoLogger.info("This is an info log");
  const sentReqUser = req.params.useridA;
  const receivedReqUser = req.params.useridB;

  mySqlConnection.query(
    `select * from Connections where (user_A_id = ${sentReqUser} and user_B_id = ${receivedReqUser}) or (user_A_id = ${receivedReqUser} and user_B_id = ${sentReqUser})`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Friend Request - Send Friend Request, Check if users are already friends or friend request already sent - FAILED"
          );
        } else {
          if (rows.length > 0) {
            if (rows[0].connected == 1) {
              return res.send(`${receivedReqUser} is already your friend`);
            } else if (rows[0].user_A_id == sentReqUser) {
              return res.send(
                `You already sent ${receivedReqUser} a friend request`
              );
            } else {
              return res.send(
                `${receivedReqUser} sent you already a friend request, you can approve it`
              );
            }
          } else {
            mySqlConnection.query(
              `insert into Connections (user_A_id, user_B_id, creation_date, last_update) values
            (${req.params.useridA}, ${req.params.useridB}, curdate(), curdate())`,
              (err, rows) => {
                try {
                  if (err || rows === undefined || rows.affectedRows < 1) {
                    throw new Error(
                      "Friend Request - POST (send friend request) MySQL Error"
                    );
                  }

                  titleToSend = `New friend request`;
                  bodyToSend = `Friend request from `;
                  sendNotificationHelper(req, res, titleToSend, bodyToSend);
                } catch (err) {
                  errLogger.error({ err });
                  return res.status(500).send(`Internal Error`);
                }
              }
            );
          }
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

approveFriendRequest = (req, res) => {
  infoLogger.info("This is an info log");
  const approvedUser = req.params.useridA;
  const sentReqUser = req.params.useridB;

  mySqlConnection.query(
    `update Connections set connected = 1 where (user_A_id = ${sentReqUser} and user_B_id = ${approvedUser})`,
    (err, rows) => {
      try {
        if (err || rows === undefined || rows.affectedRows < 1) {
          throw new Error(
            "Friend Request - PUT (UPDATE approved friend request) MySQL Error"
          );
        }

        res.send(`${approvedUser} approved friend request from ${sentReqUser}`);
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

declineFriendRequest = (req, res) => {
  infoLogger.info("This is an info log");
  const declinedUser = req.params.useridA;
  const sentReqUser = req.params.useridB;

  mySqlConnection.query(
    `DELETE FROM Connections WHERE user_A_id =${sentReqUser} and user_B_id =${declinedUser}`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Friend Request - DELETE - decline friend request, MySQL Error"
          );
        } else {
          res.send(
            `${declinedUser} declined friend request from ${sentReqUser}`
          );
        }
      } catch {
        errLogger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

module.exports = {
  getUserFriendRequestsSent,
  getUserFriendRequestsReceived,
  sendFriendRequest,
  approveFriendRequest,
  declineFriendRequest,
  getAllUserConnectionsByName,
  getAllUserConnectionsType,
};
