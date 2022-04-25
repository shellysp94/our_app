const { query, response } = require("express");
const dbConfig = require("../../config/db_config");
const { getAllUsersConfiguration, getUserConfiguration } = require('./userConfiguration');
const mySqlConnection = dbConfig;

function splitCommas(myQuery, relevantColumn, string) {
  let splittedQuery = myQuery;
  let splittedString = [];
  var numberOfCommas = string.split(",").length - 1;

  for(comma = 0; comma <= numberOfCommas; comma++)
  {
      if(comma !== numberOfCommas) {
          splittedString[comma] = "'%" + string.split(",")[comma] + "%' or " + relevantColumn + " like ";
      }
      else {
          splittedString[comma] = "'%" + string.split(",")[comma] + "%'";
      }
      splittedQuery = splittedQuery.concat(splittedString[comma]);
  }
  return splittedQuery
}

  getAllFilters = (req, res) => {
    mySqlConnection.query("SELECT * FROM Filters", (err, rows) => {
      try {
        res.send(rows);
      } 
      catch (err) {
        console.log(err.message);
      }
    });
  };

  getUserFilter = (req, callback) => {
    const userid = req.params.userid;

    mySqlConnection.query(
      "SELECT * FROM Filters WHERE user_id = ?",
      [userid],
      (err, rows) => {
        try {
          return callback(rows);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  // getUserFilter = (req, res) => {
  //   const userid = req.params.userid;

  //   mySqlConnection.query(
  //     "SELECT * FROM Filters WHERE user_id = ?",
  //     [userid],
  //     (err, rows) => {
  //       try {
  //         res.send(rows);
  //       } catch (err) {
  //         console.log(err.message);
  //       }
  //     }
  //   );
  // };

  getUsersWithCommonSearchMode = (req, callback) => {
    const searchMode = req.search_mode;

    mySqlConnection.query(
      `select user_id from filters where search_mode like '${searchMode}'`, (err,rows) => {
        try {
          return callback(rows);
        } catch (err) {
          console.log(err.message);
        }
      }
    )
  }

  getUsersWithCommonHobbiesFilter = (req, callback) => {
    const hobbiesFilter = req.hobbies_filter;
   
    let sqlQuery = splitCommas("select uc.user_id from filters f right join user_configuration uc using (user_id) where hobbies_filter like ",
    "hobbies_filter", hobbiesFilter);
    sqlQuery = sqlQuery.concat(splitCommas(" or hobbies like ", "hobbies", hobbiesFilter));

    mySqlConnection.query(
      sqlQuery,
      (err, rows) => {
        try {
          return callback(rows);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  getUsersWithCommonGenderFilter = (req, callback) => {
    const genderFilter = req.gender_filter;

    const splitGenderFilter = genderFilter.replace(/,/g, '%');
    let queryStr; 
    if(genderFilter === 'All')
    {
      queryStr = `select user_id from user_configuration where gender like 'Woman' or gender like 'Man' or gender like 'prefer not to say'`
    }
    else if(genderFilter === 'Men')
    {
      queryStr = `SELECT user_id FROM user_configuration WHERE gender like 'Man' and gender not like 'Woman'`;
    }
    else if(genderFilter === 'Women')
    {
      queryStr = `SELECT user_id FROM user_configuration WHERE gender like 'Woman'`;
    }
    else 
    {
      queryStr = `SELECT user_id FROM user_configuration WHERE gender like 'Woman' or gender like 'Man'`;
    }

    mySqlConnection.query(queryStr,
      (err, rows) => {
        try {
          return callback(rows);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  getUsersWithCommonRelationshipFilter = (req, callback) => {
    const relationshipFilter = req.relationship_filter;

    let sqlQuery = splitCommas("select uc.user_id from filters f right join user_configuration uc using (user_id) where relationship_filter like ",
    "relationship_filter", relationshipFilter);
    sqlQuery = sqlQuery.concat(splitCommas(" or relationship_status like ", "relationship_status", relationshipFilter));
    
    mySqlConnection.query(
      sqlQuery,
      (err, rows) => {
        try {
          return callback(rows);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  getUsersWithCommonInterestingInFilter = (req, callback) => {
    const interestingInFilter = req.interesting_in_filter;

    let sqlQuery = splitCommas("select user_id from filters where interesting_in_filter like ", "interesting_in_filter", interestingInFilter);

    mySqlConnection.query(
      sqlQuery,
      (err, rows) => {
        try {
          return callback(rows);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  getUsersWithCommonAgeFilter = (req, callback) => {
    const age = [];
    const from = JSON.parse(req.age_filter)[0];
    const until = JSON.parse(req.age_filter)[1];

    getAllUsersConfiguration(req, (response) => {
     response.forEach(user => {
       if(user.age >= from && user.age <= until)
       {
          age.push(user.user_id);
       }
     })
     return callback(age);
   });
  };

  getUserFriendsThatFilteredFriendsOnly = (req, callback) => {
    const userid = req.user_id;
    
    mySqlConnection.query(
      `select * from filters join connections on (filters.user_id = connections.user_A_id or filters.user_id = connections.user_B_id) 
      where user_id = ${userid} and connected = 1`,
      (err, rows) => {
        try {
          let usersFriendsOnly = [];
          for(user = 0; user < rows.length; user++)
          {
            if(!usersFriendsOnly.includes(rows[user].user_A_id) && rows[user].user_A_id !== parseInt(userid, 10)) 
            {
              usersFriendsOnly.push(rows[user].user_A_id);
            }
            if(!usersFriendsOnly.includes(rows[user].user_B_id) && rows[user].user_B_id !== parseInt(userid, 10)) 
            {
              usersFriendsOnly.push(rows[user].user_B_id);
            }
          }
          return callback(usersFriendsOnly);
        } 
        catch (err) {
          console.log(err.message);
        }
      }
    )
  };

  getUserFilteredUsers = (req, res) => {
    let searchMode = [];
    let hobbies = [];
    let gender = [];
    let relationship = [];
    let interestingIn = [];
    let allUsersWithoutMe = [];

    getUserFilter(req, (userFilter) => {
      if(userFilter.length === 0)
      {
        getAllUsersConfiguration(req, (allUsers) => {
          allUsers.forEach(user => {
            if(parseInt(user.user_id, 10) !== parseInt(req.params.userid, 10))
            {
              allUsersWithoutMe.push(user);
            }
          });
          res.send(allUsersWithoutMe);
        })
      }
      else
      {
        getUsersWithCommonSearchMode(userFilter[0], (response) => {
          response.forEach(user => {
            if(parseInt(req.params.userid, 10) !== user.user_id)
            {
              searchMode.push(user.user_id);
            }
          });
          //console.log(searchMode);
    
          getUsersWithCommonHobbiesFilter(userFilter[0], (response) => {
            //console.log(response);
            response.forEach(user => {         
              hobbies.push(user.user_id);
            });
            const mutualUsers_SearchMode_Hobbies = searchMode.filter(user => hobbies.includes(user));
            //console.log(mutualUsers_SearchMode_Hobbies);
        
            getUsersWithCommonGenderFilter(userFilter[0], (response) => {
              response.forEach(user => {         
                gender.push(user.user_id);
              });
              const mutualUsers_Hobbies_Gender = mutualUsers_SearchMode_Hobbies.filter(user => gender.includes(user));
              //console.log(mutualUsers_Hobbies_Gender)
    
              getUsersWithCommonRelationshipFilter(userFilter[0], (response) => {
                response.forEach(user => {         
                  relationship.push(user.user_id);
                });
                const mutualUsers_Gender_Relationship = mutualUsers_Hobbies_Gender.filter(user => relationship.includes(user));
                //console.log(mutualUsers_Gender_Relationship);
    
                getUsersWithCommonInterestingInFilter(userFilter[0], (response) => {
                  response.forEach(user => {         
                    interestingIn.push(user.user_id);
                  });
                  const mutualUsers_Relationship_InterestingIn = mutualUsers_Gender_Relationship.filter(user => interestingIn.includes(user));
                  //console.log(mutualUsers_Relationship_InterestingIn);
    
                  getUsersWithCommonAgeFilter(userFilter[0], (response) => {
                    const mutualUsers_InterestingIn_Age = mutualUsers_Relationship_InterestingIn.filter(user => response.includes(user));
                    //console.log(mutualUsers_InterestingIn_Age);
    
                    if(userFilter[0].friends_only_filter === 1)
                    {
                      getUserFriendsThatFilteredFriendsOnly(userFilter[0], (response) => {
                        //console.log(response);
                        const mutualUsers_Age_FriendsOnly = mutualUsers_InterestingIn_Age.filter(user => response.includes(user));
                        //console.log(mutualUsers_Age_FriendsOnly);
      
                        let resultArrayToObject = {
                          params : {userid : String(mutualUsers_Age_FriendsOnly)}
                       };
      
                       //console.log(resultArrayToObject);
                       getUserConfiguration(resultArrayToObject, res);
                      })
                    }
                    else
                    {
                      let resultArrayToObject = {
                        params : {userid : String(mutualUsers_InterestingIn_Age)}
                     };
    
                     //console.log(resultArrayToObject);
                     getUserConfiguration(resultArrayToObject, res);
                    }
                  })
                })
              })
            })
          })
        });
      }
    });

    // getUsersWithCommonSearchMode(req, (response) => {
    //   response.forEach(user => {
    //     if(parseInt(req.params.userid, 10) !== user.user_id)
    //     {
    //       searchMode.push(user.user_id);
    //     }
    //   });
    //   //console.log(searchMode);

    //   getUsersWithCommonHobbiesFilter(req, (response) => {
    //     //console.log(response);
    //     response.forEach(user => {         
    //       hobbies.push(user.user_id);
    //     });
    //     const mutualUsers_SearchMode_Hobbies = searchMode.filter(user => hobbies.includes(user));
    //     //console.log(mutualUsers_SearchMode_Hobbies);
    
    //     getUsersWithCommonGenderFilter(req, (response) => {
    //       response.forEach(user => {         
    //         gender.push(user.user_id);
    //       });
    //       const mutualUsers_Hobbies_Gender = mutualUsers_SearchMode_Hobbies.filter(user => gender.includes(user));
    //       //console.log(mutualUsers_Hobbies_Gender)

    //       getUsersWithCommonRelationshipFilter(req, (response) => {
    //         response.forEach(user => {         
    //           relationship.push(user.user_id);
    //         });
    //         const mutualUsers_Gender_Relationship = mutualUsers_Hobbies_Gender.filter(user => relationship.includes(user));
    //         //console.log(mutualUsers_Gender_Relationship);

    //         getUsersWithCommonInterestingInFilter(req, (response) => {
    //           response.forEach(user => {         
    //             interestingIn.push(user.user_id);
    //           });
    //           const mutualUsers_Relationship_InterestingIn = mutualUsers_Gender_Relationship.filter(user => interestingIn.includes(user));
    //           //console.log(mutualUsers_Relationship_InterestingIn);

    //           getUsersWithCommonAgeFilter(req, (response) => {
    //             const mutualUsers_InterestingIn_Age = mutualUsers_Relationship_InterestingIn.filter(user => response.includes(user));
    //             //console.log(mutualUsers_InterestingIn_Age);


    //             if(req.body.friends_only_filter === 1)
    //             {
    //               getUserFriendsThatFilteredFriendsOnly(req, (response) => {
    //                 //console.log(response);
    //                 const mutualUsers_Age_FriendsOnly = mutualUsers_InterestingIn_Age.filter(user => response.includes(user));
    //                 //console.log(mutualUsers_Age_FriendsOnly);
  
    //                 let resultArrayToObject = {
    //                   params : {userid : String(mutualUsers_Age_FriendsOnly)}
    //                };
  
    //                //console.log(resultArrayToObject);
    //                getUserConfiguration(resultArrayToObject, res);
    //               })
    //             }
    //             else
    //             {
    //               let resultArrayToObject = {
    //                 params : {userid : String(mutualUsers_InterestingIn_Age)}
    //              };

    //              //console.log(resultArrayToObject);
    //              getUserConfiguration(resultArrayToObject, res);
    //             }
    //           })
    //         })
    //       })
    //     })
    //   })
    // });
  };

  createUserFilter = (req, res) => {
    const userid = req.params.userid;
    const searchMode = req.body.search_mode_filter;
    const hobbiesFilter = req.body.hobbies_filter;
    const genderFilter = req.body.gender_filter;
    const relationshipFilter = req.body.relationship_filter;
    const interestingInFilter = req.body.interesting_in_filter;
    const ageFilter = req.body.age_filter;
    const friendsOnly = req.body.friends_only_filter;

    mySqlConnection.query(
      `INSERT INTO Filters (user_id, search_mode, hobbies_filter, gender_filter, relationship_filter, interesting_in_filter, age_filter, friends_only_filter) 
      values (${userid}, '${searchMode}', '${hobbiesFilter}', '${genderFilter}', '${relationshipFilter}', '${interestingInFilter}', '${ageFilter}', ${friendsOnly}) 
      ON DUPLICATE KEY UPDATE user_id = ${userid}, search_mode = '${searchMode}', hobbies_filter = '${hobbiesFilter}', gender_filter = '${genderFilter}', 
      relationship_filter = '${relationshipFilter}', interesting_in_filter = '${interestingInFilter}', age_filter = '${ageFilter}', friends_only_filter = ${friendsOnly}`,
      (err, rows) => {
        try {
          getUserFilteredUsers(req, res);
          // mySqlConnection.query(
          //   `select first_name from user_configuration where user_id = ${userid}`,
          //   (err, rows) => {
          //     try {
          //       const userName = rows[0].first_name;
          //       msgToClient = {msg: `${userName}'s filters are now updated!`};
          //       return res.send(msgToClient);
          //     } 
          //     catch (err) {
          //       console.log(err.message);
          //     }
          //   }
          // )
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  updateUserHobbiesFilter = (req, res) => {
    const hobbiesFilter = req.body.hobbies_filter;
    const userid = req.params.userid;

    mySqlConnection.query(
      "UPDATE Filters SET hobbies_filter = ? WHERE user_id = ?",
      [hobbiesFilter, userid],
      (err, result) => {
        try {
          msgToClient = {msg: `User number ${userid} updated hobbies filter to ${hobbiesFilter} successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  updateUserGenderFilter = (req, res) => {
    const genderFilter = req.body.gender_filter;
    const userid = req.params.userid;

    mySqlConnection.query(
      "UPDATE Filters SET gender_filter = ? WHERE user_id = ?",
      [genderFilter, userid],
      (err, result) => {
        try {
          msgToClient = {msg: `User number ${userid} updated gender filter to ${genderFilter} successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  updateUserRelationshipFilter = (req, res) => {
    const relationshipFilter = req.body.relationship_filter;
    const userid = req.params.userid;

    mySqlConnection.query(
      "UPDATE Filters SET relationship_filter = ? WHERE user_id = ?",
      [relationshipFilter, userid],
      (err, result) => {
        try {
          msgToClient = {msg: `User number ${userid} updated relationship filter to ${relationshipFilter} successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  updateUserInterestingInFilter = (req, res) => {
    const interestingInFilter = req.body.interesting_in_filter;
    const userid = req.params.userid;

    mySqlConnection.query(
      "UPDATE Filters SET interesting_in_filter = ? WHERE user_id = ?",
      [interestingInFilter, userid],
      (err, result) => {
        try {
          msgToClient = {msg: `User number ${userid} updated interesting in filter to ${interestingInFilter} successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  updateUserAgeFilter = (req, res) => {
    const ageFilter = req.body.age_filter;
    const userid = req.params.userid;

    mySqlConnection.query(
      "UPDATE Filters SET age_filter = ? WHERE user_id = ?",
      [ageFilter, userid],
      (err, result) => {
        try {
          msgToClient = {msg: `User number ${userid} updated age filter to ${ageFilter} successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  updateUserFriendsOnlyFilter = (req, res) => {
    const userid = req.params.userid;
    const friendsOnly = req.params.friendsOnly;

    mySqlConnection.query(
      "UPDATE Filters SET friends_only_filter = ? WHERE user_id = ?",
      [friendsOnly, userid],
      (err, result) => {
        try {
          msgToClient = {msg: `User number ${userid} updated friends only filter to ${friendsOnly} successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  deleteUserFilter = (req, res) => {
    const userid = req.params.userid;

    mySqlConnection.query(
      "delete from Filters where user_id = ?",
      [userid],
      (err, result) => {
        try {
          msgToClient = {msg: `User number ${userid} filter deleted successfully`};
          return res.send(msgToClient);
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  returnAllFiltersInSet = (req, res) => {
    let filters = { 
      Hobbies : {
        Sport : ['basketball', 'beach volleyball', 'crossfit', 'dancing', 'football/soccer', 'gym workout', 'hiking', 'pilates', 'running', 'slacklining', 'surfing', 'swimming', 'tennis', 'yoga'],
        Food : ['baking', 'cooking', 'eating outside', 'interested in culinary', 'interesting in nutrition'],
        Music : ['playing drums', 'playing guitar', 'playing in a band', 'playing piano', 'playing synthesizer', 'singing'],
        Art : ['acting', 'fashion designing', 'handicraft', 'home decorating', 'juggling', 'painting'],
        Knowledge : ['blogging', 'interested in medicine and biology', 'learning new languages', 'listening to podcasts', 'playing chess', 'puzzling', 'reading', 'writing'],
        Technology : ['coding', 'hacking', 'playing video games'],
        Outside_Inside : ['camping', 'gardening', 'sailing', 'skippering', 'shopping', 'tanning', 'traveling']},
      Search_Mode : ['Whatever', 'Beer', 'Study', 'Food', 'Training', 'Coffee', 'Shopping'],
      Gender : ['Men', 'Women', 'All'],
      Relationship : ['Divorced', 'Engaged', 'In a relationship', 'In an open relationship', 'Married', 'Single' , 'Widowed'],
      Interesting_In : ['Friends','Hookup', 'Long term relationship', 'Short term relationship', 'Sport buddy', 'Study buddy', 'Work buddy']
    }

    return res.send(filters);
  }

module.exports = {
  getAllFilters : getAllFilters,
  getUserFilter : getUserFilter,
  getUsersWithCommonSearchMode : getUsersWithCommonSearchMode,
  getUsersWithCommonHobbiesFilter : getUsersWithCommonHobbiesFilter,
  getUsersWithCommonGenderFilter : getUsersWithCommonGenderFilter,
  getUsersWithCommonRelationshipFilter : getUsersWithCommonRelationshipFilter,
  getUsersWithCommonInterestingInFilter : getUsersWithCommonInterestingInFilter,
  getUsersWithCommonAgeFilter : getUsersWithCommonAgeFilter,
  getUserFriendsThatFilteredFriendsOnly : getUserFriendsThatFilteredFriendsOnly,
  getUserFilteredUsers : getUserFilteredUsers,
  createUserFilter : createUserFilter,
  updateUserHobbiesFilter : updateUserHobbiesFilter,
  updateUserGenderFilter : updateUserGenderFilter,
  updateUserRelationshipFilter : updateUserRelationshipFilter,
  updateUserInterestingInFilter : updateUserInterestingInFilter,
  updateUserAgeFilter : updateUserAgeFilter,
  updateUserFriendsOnlyFilter : updateUserFriendsOnlyFilter,
  deleteUserFilter : deleteUserFilter,
  returnAllFiltersInSet : returnAllFiltersInSet
}