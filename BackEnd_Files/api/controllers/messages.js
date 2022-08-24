const {
	sendNotificationHelper,
} = require("../../utils/notifications/notifications");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const dbConfig = require("../../config/db_config");
const onlineUsers = new onlineUsersArray().getInstance();
const mySqlConnection = dbConfig;

getChatMessages = (req, cb) => {
	const chatID = req.params.chatID;
	const messagesOffset = req.params.messagesOffset;

	mySqlConnection.query(
		`select * from (select * from messages where chat_id = ${chatID} limit 50 offset ${messagesOffset}) as T1 order by creation_date asc`,
		(err, rows) => {
			try {
				return cb(rows);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

createChatMessage = (req, res) => {
	const sender = req.params.useridA;
	const receiver = req.params.useridB;
	const content = req.body.content;
	const senderOnlineUser = onlineUsers.getOnlineUser(sender);
	const receiverOnlineUser = onlineUsers.getOnlineUser(receiver);
	const currentChatRoom = onlineUsers
		.getOnlineUser(senderOnlineUser.user_id)
		.getAUserChatRoom(receiver)[0];

	if (senderOnlineUser === undefined || currentChatRoom === undefined) {
		res.statusCode = 404;
		res.send("ERROR! Something went wrong! **Post Message Request**");
	} else {
		const chatID = currentChatRoom.chat_id;

		mySqlConnection.query(
			`insert into messages (chat_id, creation_date, sender_user_id, receiver_user_id, content) values (${chatID}, current_timestamp(), ${sender}, ${receiver}, "${content}")`,
			(err, rows) => {
				try {
					const titleToSend = "You got a new message";
					const bodyToSend = "New message from ";
					sendNotificationHelper(req, res, titleToSend, bodyToSend);

					mySqlConnection.query(
						`select * from messages where chat_id = ${chatID} order by creation_date desc limit 1`,
						(err, rows) => {
							try {
								if (rows !== undefined && rows.length > 0) {
									if (receiverOnlineUser !== undefined) {
										// Sender and Receiver are online. Both got the message on WS
										senderOnlineUser.websocket.send(JSON.stringify(rows[0]));
										receiverOnlineUser.websocket.send(JSON.stringify(rows[0]));
									} else {
										// Only sender is online and got the message on WS
										senderOnlineUser.websocket.send(JSON.stringify(rows[0]));
									}
									res.send(rows);
								} else {
									console.log(err.message);
								}
							} catch (err) {
								console.log(err.message);
							}
						}
					);
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	}
};

deleteChatMessages = (req, cb) => {
	const chatID = req.params.chatID;

	mySqlConnection.query(
		`delete from messages where chat_id = ${chatID}`,
		(err, rows) => {
			try {
				msgToClient = {
					msg: `Chat room number ${chatID} is empty`,
				};
				return cb(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

module.exports = {
	getChatMessages,
	createChatMessage,
	deleteChatMessages,
};
