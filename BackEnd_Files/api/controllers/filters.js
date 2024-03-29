const dbConfig = require("../../config/db_config");
const {
  getAllUsersConfiguration,
  getUserConfigurationInner,
  getUsersConfigurationByRadius,
} = require("./userConfiguration");
const { getAllUserConnectionsType } = require("./friendRequest");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const onlineUsers = new onlineUsersArray().getInstance();
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

function splitCommas(myQuery, relevantColumn, string) {
  let splittedQuery = myQuery;
  let splittedString = [];
  var numberOfCommas = string.split(",").length - 1;

  for (comma = 0; comma <= numberOfCommas; comma++) {
    if (comma !== numberOfCommas) {
      splittedString[comma] =
        "'%" + string.split(",")[comma] + "%' or " + relevantColumn + " like ";
    } else {
      splittedString[comma] = "'%" + string.split(",")[comma] + "%'";
    }
    splittedQuery = splittedQuery.concat(splittedString[comma]);
  }

  return splittedQuery;
}

function noFilter(req, cb) {
  infoLogger.info("This is an info log");
  let allUsersWithoutMe = [];
  getAllUsersConfiguration(req, (allUsers) => {
    if (allUsers === undefined) {
      return cb(allUsers);
    }

    allUsers.forEach((user) => {
      if (parseInt(user.user_id, 10) !== parseInt(req.user_id, 10)) {
        allUsersWithoutMe.push(user);
      }
    });
    return cb(allUsersWithoutMe);
  });
}

//////////////////////////////////////////// Search Mode Helper /////////////////////////////////////////////
function createSearchModeQuery(searchMode) {
  return new Promise((resolve, reject) => {
    if (searchMode === undefined || searchMode.length <= 0) {
      reject(`!!SEARCH MODE!!\nSomething wrong. Search mode parameter illegal`);
    }
    if (searchMode !== "Whatever") {
      resolve(`and (search_mode like '${searchMode}')`);
    } else {
      resolve("");
    }
  });
}

//////////////////////////////////////////// Hobbies Helper /////////////////////////////////////////////
function createHobbiesQuery(hobbies) {
  return new Promise((resolve, reject) => {
    if (hobbies === undefined || hobbies.length <= 0) {
      reject(`!!HOBBIES!!\nSomething wrong. Hobbies parameter illegal`);
    }
    if (hobbies !== "Hobbies") {
      let sqlQuery = splitCommas(" and (hobbies like ", "hobbies", hobbies);
      sqlQuery = sqlQuery.concat(")");
      resolve(sqlQuery);
    } else {
      resolve("");
    }
  });
}

//////////////////////////////////////////// Gender Helper /////////////////////////////////////////////
function createGenderQuery(gender) {
  return new Promise((resolve, reject) => {
    if (gender === undefined || gender.length <= 0) {
      reject(`!!GENDER!!\nSomething wrong. Gender parameter illegal`);
    }
    if (gender === "Men") {
      resolve(` and (UC.gender like 'Man' and UC.gender not like 'Woman')`);
    } else if (gender === "Women") {
      resolve(` and (UC.gender like 'Woman')`);
    } else {
      resolve(
        ` and (UC.gender like 'Woman' or UC.gender like 'Man' or UC.gender like 'prefer not to say')`
      );
    }
  });
}

//////////////////////////////////////////// Relationship Helper /////////////////////////////////////////////
function createRelationshipQuery(relationship) {
  return new Promise((resolve, reject) => {
    if (relationship === undefined || relationship.length <= 0) {
      reject(
        `!!RELATIONSHIP!!\nSomething wrong. Relationship parameter illegal`
      );
    }
    if (relationship !== "Relationship") {
      let sqlQuery = splitCommas(
        " and (relationship_filter like ",
        "relationship_filter",
        relationship
      );
      sqlQuery = sqlQuery.concat(
        splitCommas(
          " or relationship_status like ",
          "relationship_status",
          relationship
        )
      );

      sqlQuery = sqlQuery.concat(")");
      resolve(sqlQuery);
    } else {
      resolve("");
    }
  });
}

//////////////////////////////////////////// Interested In Helpers /////////////////////////////////////////////
function interestedInHelper_AccordingToGenderAndSexualOrientation(
  currentUserGender,
  currentUserSexualOrientation,
  cb
) {
  let sqlQuery;

  switch (currentUserSexualOrientation) {
    case "Heterosexual":
      sqlQuery = `(sexual_orientation like 'Heterosexual' and gender not like '${currentUserGender}')`;
      break;
    case "Homosexual":
      sqlQuery = `(sexual_orientation like 'Homosexual' and gender like '${currentUserGender}')`;
      break;
    case "Bisexual":
      sqlQuery = `(sexual_orientation like 'Bisexual')`;
      break;
    case "Asexual":
      sqlQuery = `(sexual_orientation like 'Asexual')`;
      break;
    default:
      sqlQuery = undefined;
  }

  return cb(sqlQuery);
}

function interestedInHelper_AccordingToUserInterestedInChosen(
  interestedInFilter,
  currentUserGender,
  currentUserSexualOrientation,
  cb
) {
  let filters = interestedInFilter.split(",");
  let friendshipFilters = filters.filter(
    (filter) =>
      filter === "Friends" ||
      filter === "Sport buddy" ||
      filter === "Study buddy" ||
      filter === "Work buddy"
  );
  let relationshipFilters = filters.filter(
    (filter) =>
      filter === "Hookup" ||
      filter === "Long term relationship" ||
      filter === "Short term relationship"
  );
  let sqlQuery;
  if (friendshipFilters.length > 0 && relationshipFilters.length > 0) {
    // Both - friendship AND relationship filters
    interestedInHelper_AccordingToGenderAndSexualOrientation(
      currentUserGender,
      currentUserSexualOrientation,
      (toConcatSqlQuery) => {
        if (toConcatSqlQuery === undefined) {
          return cb(undefined);
        }
        sqlQuery = " and (";
        sqlQuery = sqlQuery.concat(toConcatSqlQuery);
        sqlQuery = sqlQuery.concat(
          splitCommas(
            " and (interested_in_filter like ",
            "interested_in_filter",
            relationshipFilters.toString()
          )
        );
        sqlQuery = sqlQuery.concat(")");
        sqlQuery = sqlQuery.concat(
          splitCommas(
            " or (interested_in_filter like ",
            "interested_in_filter",
            friendshipFilters.toString()
          )
        );
        sqlQuery = sqlQuery.concat("))");
      }
    );
  } else if (friendshipFilters.length > 0 && relationshipFilters.length === 0) {
    // Only friendship filters
    sqlQuery = splitCommas(
      " and (interested_in_filter like ",
      "interested_in_filter",
      interestedInFilter
    );
    sqlQuery = sqlQuery.concat(")");
  } else if (friendshipFilters.length === 0 && relationshipFilters.length > 0) {
    // Only relationship filters
    interestedInHelper_AccordingToGenderAndSexualOrientation(
      currentUserGender,
      currentUserSexualOrientation,
      (toConcatSqlQuery) => {
        sqlQuery = " and ";
        sqlQuery = sqlQuery.concat(toConcatSqlQuery);
        sqlQuery = sqlQuery.concat(
          splitCommas(
            " and (interested_in_filter like ",
            "interested_in_filter",
            interestedInFilter
          )
        );
        sqlQuery = sqlQuery.concat(")");
      }
    );
  }
  return cb(sqlQuery);
}

function createInterestedInQuery(req) {
  infoLogger.info("This is an info log");
  let interestedIn = req.interested_in_filter;
  let currentUserId = req.user_id;

  return new Promise((resolve, reject) => {
    if (interestedIn === undefined || interestedIn.length <= 0) {
      reject(
        `!!INTERESTED IN!!\nSomething went wrong. Interested In parameter illegal`
      );
    }
    if (interestedIn !== "Interested in") {
      mySqlConnection.query(
        `select gender, sexual_orientation from user_configuration where user_id = ${currentUserId}`,
        (err, rows) => {
          try {
            let currentUserGender = rows[0].gender;
            let currentUserSexualOrientation = rows[0].sexual_orientation;
            interestedInHelper_AccordingToUserInterestedInChosen(
              interestedIn,
              currentUserGender,
              currentUserSexualOrientation,
              (sqlQuery) => {
                if (sqlQuery === undefined || sqlQuery.length <= 0) {
                  reject(
                    `!!INTERESTED IN!!\nSomething went wrong. Interested In parameter illegal`
                  );
                } else {
                  resolve(sqlQuery);
                }
              }
            );
          } catch (err) {
            console.log(err);
            reject(
              `!!INTERESTED IN!!\nSomething went wrong. Interested In parameter illegal`
            );
          }
        }
      );
    } else {
      resolve("");
    }
  });
}

//////////////////////////////////////////// Age Helper /////////////////////////////////////////////
getUsersWithCommonAgeFilter = (req, cb) => {
  infoLogger.info("This is an info log");
  const age = [];
  const from = JSON.parse(req.age_filter)[0];
  const until = JSON.parse(req.age_filter)[1];

  if (from === undefined || until === undefined) {
    noFilter(req, (allUsersWithoutMe) => {
      return cb(allUsersWithoutMe);
    });
  } else {
    getAllUsersConfiguration(req, (response) => {
      if (response === undefined) {
        return cb(response);
      }
      response.forEach((user) => {
        if (parseInt(user.age, 10) >= from && parseInt(user.age, 10) <= until) {
          age.push(user);
        }
      });
      return cb(age);
    });
  }
};

//////////////////////////////////////////// Friends Of Friends Helper /////////////////////////////////////////////
function createFriendsOfFriendsQuery(myFriendsUserid, sqlQuery, cb) {
  arrayLength = myFriendsUserid.length;

  for (user = 0; user < arrayLength; user++) {
    if (user === 0) {
      sqlQuery = sqlQuery.concat(
        `user_A_id = ${myFriendsUserid[user]} or user_B_id = ${myFriendsUserid[user]}`
      );
    } else {
      sqlQuery = sqlQuery.concat(
        ` or user_A_id = ${myFriendsUserid[user]} or user_B_id = ${myFriendsUserid[user]}`
      );
    }
  }
  sqlQuery = sqlQuery.concat(")");

  return cb(sqlQuery);
}

//////////////////////////////////////////// Only Online Users Helper /////////////////////////////////////////////
function getUserFilteredUsers_OnlyOnline_Helper(
  onlyOnline,
  withFilters,
  userid,
  type,
  usersToPresent,
  res
) {
  let createdUsersToPresent = [];

  if (parseInt(onlyOnline, 10) === 1) {
    if (parseInt(withFilters, 10) === 1) {
      // Return users according to filters but only online users //
      usersToPresent.forEach((user) => {
        if (onlineUsers.includesAUser(user)) {
          createdUsersToPresent.push(user);
        }
      });
    } else {
      // Return all online users //
      onlineUsers.getOnlineUsersArray().forEach((onlineUser) => {
        if (parseInt(onlineUser.user_id, 10) !== parseInt(userid)) {
          createdUsersToPresent.push(parseInt(onlineUser.user_id, 10));
        }
      });
    }
  } else {
    if (parseInt(withFilters, 10) === 1) {
      // Return users according to filters - online and offline //
      usersToPresent.forEach((user) => {
        createdUsersToPresent.push(user);
      });
    } else {
      // Return users without any filters - online and offline //
      createdUsersToPresent = [0];
    }
  }

  let resultArrayToObject = {
    params: {
      userid: userid,
      type: type,
      usersToPresent: createdUsersToPresent,
    },
  };

  getAllUserConnectionsType(resultArrayToObject, res);
}

//////////////////////////////////////////// Filter's API /////////////////////////////////////////////
getAllFilters = (req, res) => {
  infoLogger.info("This is an info log");
  mySqlConnection.query("SELECT * FROM Filters", (err, rows) => {
    try {
      if (err || rows === undefined) {
        throw new Error(
          "Filters - GET request, get all filters in DB. MySQL Error"
        );
      } else {
        res.send(rows);
      }
    } catch (err) {
      errLogger.error({ err });
      return res.status(500).send("internal error");
    }
  });
};

getUserFilter = (req, cb) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;

  mySqlConnection.query(
    "SELECT * FROM Filters WHERE user_id = ?",
    [userid],
    (err, rows) => {
      return cb(rows);
    }
  );
};

getFriendsOfFriends = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;
  let myFriends_myFriendsOfFriends = {};
  let myFriendsUserid = [];
  let myFriendsOfFriendsUserid = [];
  let sqlQuery = `select * from Connections where connected = 1 and (user_A_id != ${userid} and user_B_id != ${userid}) and (`;

  mySqlConnection.query(
    `select user_A_id, user_B_id from Connections where (user_A_id = ${userid} or user_B_id = ${userid}) and connected = 1`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Filters - friends of friends. GET request, MySQL Error"
          );
        } else {
          if (rows.length > 0) {
            for (row = 0; row < rows.length; row++) {
              if (parseInt(rows[row].user_A_id, 10) !== parseInt(userid, 10)) {
                myFriendsUserid.push(parseInt(rows[row].user_A_id, 10));
              } else {
                myFriendsUserid.push(parseInt(rows[row].user_B_id, 10));
              }
            }

            createFriendsOfFriendsQuery(
              myFriendsUserid,
              sqlQuery,
              (response) => {
                if (response === undefined) {
                  throw new Error(
                    "Filters - friends of friends. Create friends of friends function cb failed"
                  );
                }

                console.log(response);
                mySqlConnection.query(response, (err, rows) => {
                  try {
                    if (err || rows === undefined) {
                      throw new Error(
                        "Filters - friends of friends. MySQL Error"
                      );
                    } else {
                      if (rows.length > 0) {
                        for (
                          myFriendOfFriend = 0;
                          myFriendOfFriend < rows.length;
                          myFriendOfFriend++
                        ) {
                          if (
                            !myFriendsUserid.includes(
                              parseInt(rows[myFriendOfFriend].user_A_id, 10)
                            )
                          ) {
                            myFriendsOfFriendsUserid.push(
                              parseInt(rows[myFriendOfFriend].user_A_id, 10)
                            );
                          }
                          if (
                            !myFriendsUserid.includes(
                              parseInt(rows[myFriendOfFriend].user_B_id, 10)
                            )
                          ) {
                            myFriendsOfFriendsUserid.push(
                              parseInt(rows[myFriendOfFriend].user_B_id, 10)
                            );
                          }
                        }
                      }

                      let myFriendsRequest = {
                        params: {
                          userid: String(myFriendsUserid),
                        },
                      };
                      let myFriendsOfFriendsRequest = {
                        params: {
                          userid: String(myFriendsOfFriendsUserid),
                        },
                      };
                      getUserConfigurationInner(
                        myFriendsRequest,
                        userid,
                        (myFriendsConfigurations) => {
                          if (myFriendsConfigurations === undefined) {
                            throw new Error(
                              "Filters - friends of friends. **MY FRIENDS CONFIGURATIONS**\nGet Users Configuration Inner (cb) failed"
                            );
                          }

                          Object.assign(myFriends_myFriendsOfFriends, {
                            myFriends: myFriendsConfigurations,
                          });

                          getUserConfigurationInner(
                            myFriendsOfFriendsRequest,
                            userid,
                            (myFriendsOfFriendsConfigurations) => {
                              if (myFriendsConfigurations === undefined) {
                                throw new Error(
                                  "Filters - friends of friends. **MY FRIENDS OF FRIENDS CONFIGURATIONS**\nGet Users Configuration Inner (cb) failed"
                                );
                              }

                              Object.assign(myFriends_myFriendsOfFriends, {
                                myFriendsOfFriends:
                                  myFriendsOfFriendsConfigurations,
                              });
                              res.send(myFriends_myFriendsOfFriends);
                            }
                          );
                        }
                      );
                    }
                  } catch (err) {
                    errLogger.error({ err });
                    return res.status(500).send("internal error");
                  }
                });
              }
            );
          } else {
            return res.send(rows);
          }
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send("internal error");
      }
    }
  );
};

getUserFilteredUsers = (req, res) => {
  infoLogger.info("This is an info log");
  let onlyOnline = req.params.onlyOnline;
  let usersToPresent = [];
  let mutuals = [];
  let age = [];
  let radius = [];
  let sqlQuery = `select UC.user_id from user_configuration UC left join Filters F using(user_id) where (UC.user_id != ${req.params.userid}) `;
  let resolve;

  getUserFilter(req, async (userFilter) => {
    if (userFilter === undefined) {
      errLogger.error("Filters - GET a user filters, MySQL Error");
      return res.status(500).send(`Internal Error`);
    }

    if (userFilter.length === 0) {
      // user don't have filters - return to client all users in db
      getUserFilteredUsers_OnlyOnline_Helper(
        onlyOnline,
        0,
        req.params.userid,
        0,
        usersToPresent,
        res
      );
    } else {
      try {
        resolve = await createSearchModeQuery(userFilter[0].search_mode);
        sqlQuery = sqlQuery.concat(resolve);
        resolve = await createHobbiesQuery(userFilter[0].hobbies_filter);
        sqlQuery = sqlQuery.concat(resolve);
        resolve = await createGenderQuery(userFilter[0].gender_filter);
        sqlQuery = sqlQuery.concat(resolve);
        resolve = await createRelationshipQuery(
          userFilter[0].relationship_filter
        );
        sqlQuery = sqlQuery.concat(resolve);
        resolve = await createInterestedInQuery(userFilter[0]);
        sqlQuery = sqlQuery.concat(resolve);

        mySqlConnection.query(sqlQuery, (err, rows) => {
          try {
            if (err || rows === undefined) {
              throw new Error(
                "Filters - Get (maybe came from POST || UPDATE request) request - MySQL syntax Error"
              );
            } else {
              if (rows === 0) {
                res.send(rows);
              } else {
                for (var user of rows) {
                  mutuals.push(user.user_id);
                }

                getUsersWithCommonAgeFilter(userFilter[0], (response) => {
                  try {
                    if (response === undefined) {
                      throw new Error(
                        "Filters - GET (maybe came from POST || UPDATE request) request\nGet users with common age filter || no filter || get configuration inner CB failed"
                      );
                    }
                    response.forEach((user) => {
                      if (mutuals.includes(user.user_id)) {
                        age.push(user.user_id);
                      }
                    });

                    getUsersConfigurationByRadius(userFilter[0], (response) => {
                      try {
                        if (response === undefined) {
                          throw new Error(
                            "Filters - GET (maybe came from POST || UPDATE request) request\nGet Users Configuration By Radius"
                          );
                        }

                        response.forEach((user) => {
                          if (age.includes(user.user_id)) {
                            radius.push(user.user_id);
                          }
                        });

                        getUserFilteredUsers_OnlyOnline_Helper(
                          onlyOnline,
                          1,
                          req.params.userid,
                          userFilter[0].friends_only_filter,
                          radius,
                          res
                        );
                      } catch (err) {
                        errLogger.error({ err });
                        return res.status(500).send(`Internal Error`);
                      }
                    });
                  } catch (err) {
                    errLogger.error({ err });
                    return res.status(500).send(`Internal Error`);
                  }
                });
              }
            }
          } catch (err) {
            errLogger.error({ err });
            return res.status(500).send(`Internal Error`);
          }
        });
      } catch (resolve) {
        errLogger.error({ resolve });
        return res.status(500).send(`Internal Error\n${resolve}`);
      }
    }
  });
};

createUserFilter = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;
  const searchMode = req.body.search_mode_filter;
  const hobbiesFilter = req.body.hobbies_filter;
  const genderFilter = req.body.gender_filter;
  const relationshipFilter = req.body.relationship_filter;
  const interestedInFilter = req.body.interested_in_filter;
  const radiusFilter = req.body.radius_filter;
  const friendsOnly = req.body.friends_only_filter;
  let ageFilter = req.body.age_filter;
  let toBroadcastAllOnline = true;

  if (ageFilter.length === 0) {
    ageFilter = "[]";
  } else {
    ageFilter = "[";
    ageFilter = ageFilter.concat(req.body.age_filter[0]);
    ageFilter = ageFilter.concat(",");
    ageFilter = ageFilter.concat(req.body.age_filter[1]);
    ageFilter = ageFilter.concat("]");
  }
  mySqlConnection.query(
    `select search_mode from Filters where user_id = ${userid}`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error(
            "Filters - UPDATE || INSERT --> select search mode for broadcast to ws, MySQL Error"
          );
        }
        if (rows.length > 0) {
          if (rows[0].search_mode === searchMode) {
            toBroadcastAllOnline = false;
          }
        }

        mySqlConnection.query(
          `INSERT INTO Filters (user_id, search_mode, hobbies_filter, gender_filter, relationship_filter, interested_in_filter, age_filter, radius_filter, friends_only_filter) 
			  values (${userid}, '${searchMode}', '${hobbiesFilter}', '${genderFilter}', '${relationshipFilter}', '${interestedInFilter}', '${ageFilter}', ${radiusFilter}, ${friendsOnly}) 
			  ON DUPLICATE KEY UPDATE user_id = ${userid}, search_mode = '${searchMode}', hobbies_filter = '${hobbiesFilter}', gender_filter = '${genderFilter}', 
			  relationship_filter = '${relationshipFilter}', interested_in_filter = '${interestedInFilter}', age_filter = '${ageFilter}', radius_filter = ${radiusFilter}, friends_only_filter = ${friendsOnly}`,
          (err, rows) => {
            try {
              if (err || rows === undefined || rows.affectedRows < 1) {
                throw new Error(
                  "Filters - UPDATE || INSERT to DB - MySQL syntax Error"
                );
              } else {
                if (toBroadcastAllOnline) {
                  onlineUsers.getOnlineUsersArray().forEach((onlineUser) => {
                    if (
                      parseInt(onlineUser.getUserId(), 10) !==
                      parseInt(userid, 10)
                    ) {
                      onlineUser
                        .getWebSocket()
                        .send(
                          JSON.stringify({ msg: "User Updated Search Mode" })
                        );
                    }
                  });
                }

                getUserFilteredUsers(req, res);
              }
            } catch (err) {
              errLogger.error({ err });
              return res.status(500).send(`Internal Error`);
            }
          }
        );
      } catch (err) {}
    }
  );
};

deleteUserFilter = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;

  mySqlConnection.query(
    `delete from Filters where user_id = ${userid}`,
    (err, rows) => {
      try {
        if (err || rows === undefined) {
          throw new Error("Filters - DELETE request. MySQL Error");
        } else {
          msgToClient = {
            msg: `User number ${userid} filter deleted successfully`,
          };
          return res.send(msgToClient);
        }
      } catch (err) {
        errLogger.error({ err });
        return res.status(500).send(`Internal Error`);
      }
    }
  );
};

module.exports = {
  getAllFilters,
  getUserFilter,
  getFriendsOfFriends,
  getUserFilteredUsers,
  createUserFilter,
  deleteUserFilter,
};
