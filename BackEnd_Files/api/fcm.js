const {admin} = require("../config/firebase_config");
const dbConfig = require("../config/db_config");
const mySqlConnection = dbConfig;
const {createUserNotification} = require("./controllers/notifications");
const {infoLogger, errLogger} = require("../utils/logger");

sendNotification = (
	res,
	deviceTokenToSend,
	titleToSend,
	bodyToSend,
	userIdToSend
) => {
	infoLogger.info("This is an info log");
	const message_notification = {
		notification: {
			title: titleToSend,
			body: bodyToSend,
		},
	};

	const notification_options = {
		priority: "high",
		timeToLive: 60 * 60 * 24,
	};

	admin
		.messaging()
		.sendToDevice(deviceTokenToSend, message_notification, notification_options)
		.then((response) => {
			// sqlQuery = `insert into notifications (notification_id, user_id, content, title, creation_date) values (${response.multicastId},${userIdToSend},'${bodyToSend}','${titleToSend}',CURRENT_TIMESTAMP())`;

			// mySqlConnection.query(sqlQuery, (err,rows) =>
			// {
			//     try
			//     {
			//         res.send(`${titleToSend} sent`);
			//     }

			//     catch(err)
			//     {
			//         console.log(err);
			//     }
			// });

			let resultArrayToObject = {
				body: {
					notification_id: String(response.multicastId),
					user_id: String(userIdToSend),
					content: String(bodyToSend),
					title: String(titleToSend),
				},
			};

			createUserNotification(resultArrayToObject, (notification) => {
				if (notification === undefined) {
					throw new Error(
						"Notifications (FCM) - create user notification return undefined"
					);
				} else {
					res.send(notification);
				}
			});
		})
		.catch((err) => {
			errLogger.error({err});
			return res.status(500).send("Internal Error");
		});
};

module.exports = {
	sendNotification,
};
