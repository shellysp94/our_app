const {admin} = require("../config/firebase_config")
const dbConfig = require("../config/db_config");
const mySqlConnection = dbConfig;

module.exports = {
   sendNotification: (res,deviceTokenToSend,titleToSend, bodyToSend, userIdToSend) =>
    {
        const message_notification = {
            notification: {
               title: titleToSend,
               body: bodyToSend
                   }
            };

        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
          };

          admin.messaging().sendToDevice(deviceTokenToSend, message_notification, notification_options)
          .then( response => 
            { 
                sqlQuery = `insert into notifications (notification_id, user_id, content, title, creation_date) values (${response.multicastId},${userIdToSend},'${bodyToSend}','${titleToSend}',CURRENT_TIMESTAMP())`;

                mySqlConnection.query(sqlQuery, (err,rows) =>
                {
                    try
                    {
                        res.send(`${titleToSend} sent`);
                    }

                    catch(err)
                    {
                        console.log(err);
                    }
                })
            })

            .catch(error =>
                {
                    console.log(error);
                })
        }
}
