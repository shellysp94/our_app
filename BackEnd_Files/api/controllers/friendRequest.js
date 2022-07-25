const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const {getUserConfigurationInner} = require("./userConfiguration");
const {sendNotification} = require("../fcm");
const {admin} = require("../../config/firebase_config")

const {sendNotificationHelper} = require("../../utils/notifications/notifications");


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
        user_id = req.params.userid;
        mySqlConnection.query(
			`SELECT * FROM Connections WHERE (user_A_id = ${user_id} OR user_B_id = ${user_id}) AND connected = 1`,
			(err, rows) => {
				try {
					let userConnectedConnections = [];
					getConnectionsForConfiguration(user_id, rows, userConnectedConnections);
					let resultArrayToObject = {
						params: {userid: String(userConnectedConnections)},
					};

                    getUserConfigurationInner(resultArrayToObject,user_id,(config) =>
                    {
                            res.send(config);   
                    });  
				} catch (err) {
					console.log(err.message);
				}
			}
		);
    },

    sendFriendRequest: (req,res) =>
    {
        mySqlConnection.query(`insert into connections (user_a_id, user_b_id, creation_date, last_update) values
        (?,?, curdate(), curdate())`, [req.params.useridA, req.params.useridB], (err,rows)=>
        {
            try
            {
                sendNotificationHelper(req,res);
                // mySqlConnection.query(`SELECT b.*, a.device_token
                // from device_token a
                // join user_configuration b
                // on a.user_id = b.user_id
                // where a.user_id = ? or b.user_id = ?`, [req.params.useridB, req.params.useridA], (newErr, newRows) =>
                // {
                //     try
                //     {
                //         if(newRows.length > 0)
                //         {
                //             valuesForNotification = extractParametersForNotification(req,newRows);
                //             sendNotification(res, valuesForNotification.deviceTokenToSend, valuesForNotification.titleToSend, valuesForNotification.bodyToSend, valuesForNotification.userIdTosend);
                //         }
                //     }

                //     catch(newErr)
                //     {
                //         console.log(newErr);
                //     }
                // });
            }

            catch(err)
            {
                console.log(err);
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
            
   /*  approveFriendRequest: (req,res) =>
    {
        const approvedUser = req.params.useridA;
        const sentReqUser = req.params.useridB;

        mySqlConnection.query(`insert into connections (user_a_id, user_b_id, connected, creation_date, last_update) values
        (?,?,?, curdate(), curdate())`, [approvedUser, sentReqUser, 1], (err,rows)=>
        {
            try
            {
                mySqlConnection.query(`update connections set connected = 1 where (user_A_id = ? and user_B_id = ?)`,[sentReqUser,approvedUser], (newErr,newRows)=>
                {
                    try
                    {
                        res.send(`${approvedUser} approved friend request from ${sentReqUser}`);
                    }

                    catch(newErr)
                    {
                        console.log(newErr);
                    }
                });
            }
            catch(err)
            {
                console.log(err);
            }
        });
    } */
}