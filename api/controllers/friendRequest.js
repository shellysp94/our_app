const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const {getUserConfigurationInner} = require("./userConfiguration");
const {sendNotification} = require("../fcm");
const {admin} = require("../../config/firebase_config")


module.exports = {
    getUserFriendRequestsRecieved: (req, res) => 
    {
        mySqlConnection.query(`SELECT b.*
        from connections a
        join user_configuration b
        on a.user_A_id = b.user_id
        where a.user_B_id = ? and a.connected =0;`, [req.params.userid], (err, rows) =>
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

                    getUserConfigurationInner(resultArrayToObject,(config) =>
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
        mySqlConnection.query(`SELECT b.*
        from connections a
        join user_configuration b
        on a.user_B_id = b.user_id
        where a.user_A_id = ? and a.connected =0;`, [req.params.userid], (err, rows) =>
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

                    getUserConfigurationInner(resultArrayToObject,(config) =>
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

    sendFriendRequest: (req,res) =>
    {
        mySqlConnection.query(`insert into connections (user_a_id, user_b_id, creation_date, last_update) values
        (?,?, curdate(), curdate())`, [req.params.useridA, req.params.useridB], (err,rows)=>
        {
            try
            {
                mySqlConnection.query(`select* from device_token where user_id=?`, [req.params.useridB], (newErr, newRows) =>
                {
                    try
                    {
                        if(newRows.length > 0)
                        {
                            var deviceTokenToSend = newRows[0].device_token;
                            msgToSend = "Friend request from ${req.params.useridA} to ${req.params.useridB} sent"
                            //sendNotification(deviceTokenToSend,msgToSend);
                            /// checkkkkk

                            const message_notification = {
                                notification: {
                                   title: "friend request",
                                   body: "enter_message_here"
                                       }
                                };

                            const notification_options = {
                                priority: "high",
                                timeToLive: 60 * 60 * 24
                              };

                              admin.messaging().sendToDevice(deviceTokenToSend, message_notification, notification_options)
                              .then( response => {
                        
                                res.send(`Friend request from ${req.params.useridA} to ${req.params.useridB} sent`);
                               
                              })
                        }
                    }

                    catch(newErr)
                    {
                        console.log(newErr);
                    }
                    
                });
                
                res.send(`Friend request from ${req.params.useridA} to ${req.params.useridB} sent`);
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
    }
}