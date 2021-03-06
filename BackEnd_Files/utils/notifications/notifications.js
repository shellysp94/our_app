const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const {getUserConfigurationInner} = require("../../api/controllers/userConfiguration");
const {sendNotification} = require("../../api/fcm");
const {admin} = require("../../config/firebase_config")


const sendNotificationHelper = (req,res) =>
{
    mySqlConnection.query(`SELECT b.*, a.device_token
                from device_token a
                join user_configuration b
                on a.user_id = b.user_id
                where a.user_id = ? or b.user_id = ?`, [req.params.useridB, req.params.useridA], (newErr, newRows) =>
                {
                    try
                    {
                        if(newRows.length > 0)
                        {
                            valuesForNotification = extractParametersForNotification(req,newRows);
                            sendNotification(res, valuesForNotification.deviceTokenToSend, valuesForNotification.titleToSend, valuesForNotification.bodyToSend, valuesForNotification.userIdTosend);
                        }
                    }
                    catch(newErr)
                    {
                        console.log(newErr);
                    }
                });
}

const extractParametersForNotification = (req, newRows) => 
{
    let tokensArr=[]
    for(var i = 0; i<newRows.length; i++)
    {
        if(newRows[i].user_id == req.params.useridB)
        {
            tokensArr.push(newRows[i].device_token)
        }

        if(newRows[i].user_id == req.params.useridA)
        {
            var senderName = newRows[i].first_name +" "+ newRows[i].last_name;
        }
    }
    const paramsForNotification = {deviceTokenToSend: tokensArr, titleToSend:"New friend request", bodyToSend: `Friend request from ${senderName}`,  userIdTosend: req.params.useridB}
    return paramsForNotification;
}

module.exports = {extractParametersForNotification,sendNotificationHelper}
