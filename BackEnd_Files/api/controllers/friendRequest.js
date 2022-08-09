const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const {getUserConfigurationInner} = require("./userConfiguration");
const {sendNotification} = require("../fcm");
const {admin} = require("../../config/firebase_config")

const {sendNotificationHelper} = require("../../utils/notifications/notifications");
//const { query } = require("express");


// const extractParametersForNotification = (req, newRows) => 
// {
//     let tokensArr=[]
//     for(var i = 0; i<newRows.length; i++)
//     {
//         if(newRows[i].user_id == req.params.useridB)
//         {
//             tokensArr.push(newRows[i].device_token)
//         }

//         if(newRows[i].user_id == req.params.useridA)
//         {
//             var senderName = newRows[i].first_name +" "+ newRows[i].last_name;
//         }
//     }
//     const paramsForNotification = {deviceTokenToSend: tokensArr, titleToSend:"New friend request", bodyToSend: `Friend request from ${senderName}`,  userIdTosend: req.params.useridB}
//     return paramsForNotification;
// }

function getConnectionsForConfiguration(user, rows, userConnections) {
	const rowsLength = rows.length;

	for (i = 0; i < rowsLength; i++) {
		if (
			!userConnections.includes(rows[i].user_A_id) &&
			rows[i].user_A_id !== parseInt(user, 10)
		) {
			userConnections.push(rows[i].user_A_id);
		} else if (
			!userConnections.includes(rows[i].user_B_id) &&
			rows[i].user_B_id !== parseInt(user, 10)
		) {
			userConnections.push(rows[i].user_B_id);
		}
	}
}

module.exports = {
    getUserFriendRequestsRecieved: (req, res) => 
    {
        user_id = req.params.userid;
        mySqlConnection.query(`SELECT b.*
        from connections a
        join user_configuration b
        on a.user_A_id = b.user_id
        where a.user_B_id = ? and a.connected =0;`, [user_id], (err, rows) =>
        {
            try
            {
                if(rows.length>0)
                {
                    let usersArr=[];
                    for(let i =0 ; i<rows.length;i++)
                    {
                        usersArr.push(rows[i].user_id)
                    }

                    let resultArrayToObject = {
                        params: {userid: String(usersArr)},
                    };

                    getUserConfigurationInner(resultArrayToObject,user_id,(config) =>
                    {
                            res.send(config);   
                    });   
                }
                else
                {
                    res.send([]);
                }
            }

            catch (err)
            {
                console.log(err);
            }
        });
    },

    getUserFriendRequestsSent: (req,res) =>
    {
        user_id = req.params.userid;

        mySqlConnection.query(`SELECT b.*
        from connections a
        join user_configuration b
        on a.user_B_id = b.user_id
        where a.user_A_id = ? and a.connected =0;`, [user_id], (err, rows) =>
        {
            try
            {
                if(rows.length>0)
                {
                    let usersArr=[];
                    for(let i =0 ; i<rows.length;i++)
                    {
                        usersArr.push(rows[i].user_id)
                    }

                    let resultArrayToObject = {
                        params: {userid: String(usersArr)},
                    };

                    getUserConfigurationInner(resultArrayToObject,user_id,(config) =>
                    {
                            res.send(config);   
                    });   
                }
                else
                {
                    res.send([]);
                }
            }

            catch (err)
            {
                console.log(err);
            }
        });
    },    

    getMyFriends: (req,res) =>
    {
        const userid = req.params.userid;
		const type = req.params.type;
		const usersToPresent = req.params.usersToPresent;
		let usersConfigurations = [];
		let mergeObjects = [];

		mySqlConnection.query(
			`select distinct user_id, 
				if((user_a_id = ${userid} or user_b_id = ${userid}) and connected = 1, 1, 0) mutualConnections,
				if(user_a_id = ${userid} and connected = 0, 1, 0) requestsUserSent,
				if(user_b_id = ${userid} and connected = 0, 1, 0) requestsUserReceived, 
				if((user_a_id != ${userid} and user_b_id != ${userid}) or (user_a_id is null and user_b_id is null), 1, 0) notConnected
			from connections right join user_configuration on(user_id = user_a_id or user_id = user_b_id) 
			where user_id != ${userid}`,
			(err, rows) => {
				try {
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
						params: {userid: String(usersConfigurations)},
					};
					getUserConfigurationInner(
						resultArrayToObject,
						(resultFromConfiguration) => {
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
						}
					);
				} catch (err) {
					console.log(err.message);
				}
			}
		);
        // user_id = req.params.userid;
        // mySqlConnection.query(
		// 	`SELECT * FROM Connections WHERE (user_A_id = ${user_id} OR user_B_id = ${user_id}) AND connected = 1`,
		// 	(err, rows) => {
		// 		try {
		// 			let userConnectedConnections = [];
		// 			getConnectionsForConfiguration(user_id, rows, userConnectedConnections);
		// 			let resultArrayToObject = {
		// 				params: {userid: String(userConnectedConnections)},
		// 			};

        //             getUserConfigurationInner(resultArrayToObject,user_id,(config) =>
        //             {
        //                     res.send(config);   
        //             });  
		// 		} catch (err) {
		// 			console.log(err.message);
		// 		}
		// 	}
		// );
    },

    sendFriendRequest: async (req,res) =>
    {
        const sentReqUser = req.params.useridA;
        const recievedReqUser = req.params.useridB;

        mySqlConnection.query(`select * from connections where (user_A_id = ${sentReqUser} and user_B_id = ${recievedReqUser}) or (user_A_id = ${recievedReqUser} and user_B_id = ${sentReqUser})`, (err,rows) =>
        {
            if(rows.length > 0)
            {
                if(rows[0].connected ==1)
                {
                    return res.send(`${recievedReqUser} is already your friend`);
                }

                else if (rows[0].user_A_id == sentReqUser)
                {
                    return res.send(`You already sent ${recievedReqUser} a friend request`);
                }

                else
                {
                    return res.send(`${recievedReqUser} sent you already a friend request, you can approve it`);
                }
            }

            else
            {
                mySqlConnection.query(`insert into connections (user_a_id, user_b_id, creation_date, last_update) values
                (?,?, curdate(), curdate())`, [req.params.useridA, req.params.useridB], (err,rows)=>
                {
                    try
                    {
                        titleToSend = `New friend request`;
                        bodyToSend= `Friend request from `;
                        sendNotificationHelper(req,res,titleToSend,bodyToSend);
                    }
        
                    catch(err)
                    {
                        console.log(err);
                    }
                });
            }
        });
    },

    approveFriendRequest: (req,res) =>
    {
        const approvedUser = req.params.useridA;
        const sentReqUser = req.params.useridB;

        mySqlConnection.query(`update connections set connected = 1 where (user_A_id = ? and user_B_id = ?)`,[sentReqUser,approvedUser], (err,rows)=>
        {
            try
            {
                res.send(`${approvedUser} approved friend request from ${sentReqUser}`);
            }

            catch(err)
            {
                console.log(newErr);
            }
        });
    },

    declineFriendRequest: (req,res) =>
    {
        const declinedUser = req.params.useridA;
        const sentReqUser = req.params.useridB;

        mySqlConnection.query(`DELETE FROM connections WHERE user_A_id =${sentReqUser} and user_B_id =${declinedUser}`, (err,rows) =>
        {
            try
            {
                res.send(`${declinedUser} declined friend request from ${sentReqUser}`);
            }

            catch
            {
                console.log(err.message);
            }
        });
    }
}