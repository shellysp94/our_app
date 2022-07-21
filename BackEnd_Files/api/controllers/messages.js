const dbConfig = require("../../config/db_config");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const messageFormat = require("../../utils/messagesFormat/messages");
const mySqlConnection = dbConfig;
const onlineUsers = new onlineUsersArray().getInstance();

getChatMessages = (req, res) => {
	const chatID = req.params.chatID;
	const messagesOffset = req.params.messagesOffset;

	mySqlConnection.query(
		`select * from (select * from messages where chat_id = ${chatID} limit 50 offset ${messagesOffset}) as T1 order by creation_date asc`,
		(err, rows) => {
			try {
				if (typeof rows === "undefined" || rows.length === 0) {
					msgToClient = {
						msg: `Chat room number ${chatID} is empty.`,
					};
					return res.send(msgToClient);
				} else {
					res.send(rows);
				}
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

createChatMessage = (req, res) => {
	const sender = req.params.sender;
	const receiver = req.params.receiver;
	const content = req.body.content;
	const senderOnlineUser = onlineUsers.getOnlineUser(sender);
	const receiverOnlineUser = onlineUsers.getOnlineUser(receiver);
	const currentChatRoom = onlineUsers
		.getOnlineUser(senderOnlineUser.user_id)
		.getAUserChatRoom(receiver)[0];
	const chatID = currentChatRoom.chat_id;
	console.log("honey im here! (create message)");

	mySqlConnection.query(
		`insert into messages (chat_id, creation_date, sender_user_id, receiver_user_id, content) values (${chatID}, current_timestamp(), ${sender}, ${receiver}, "${content}")`,
		(err, rows) => {
			try {
				mySqlConnection.query(
					`select * from messages where chat_id = ${chatID} order by creation_date desc limit 1`,
					(err, rows) => {
						if (typeof rows === "undefined" || rows.length === 0) {
							msgToClient = {
								msg: `Something went wrong! Message don't added and don't sent.`,
							};
							return res.send(msgToClient);
						} else {
							console.log("The row from DB:\n" + JSON.stringify(rows[0]));
							// message from sender to receiver in their chat room insert to the database
							// need to send the message to these users (sender and receiver)

							// const message = messageFormat(
							// 	sender,
							// 	receiver,
							// 	senderOnlineUser.getUserName(),
							// 	content
							// );
							//console.log(message);

							if (typeof receiverOnlineUser !== "undefined") {
								// sender and receiver are online - should send each of them the message in their chat room
								senderOnlineUser.websocket.send(JSON.stringify(rows[0]));
								receiverOnlineUser.websocket.send(JSON.stringify(rows[0]));
							} else {
								// message from sender to receiver insert to the database and save in the relevant chat room
								// but the receiver is offline now, so should send notification to the receiver that he has a new message!
								senderOnlineUser.websocket.send(JSON.stringify(rows[0]));
								console.log(
									`user number ${sender} sent a message to user number ${receiver}.\nthe message is: ${JSON.stringify(
										rows[0]
									)}`
								);
							}
						}
						res.send(rows);
					}
				);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

deleteChatMessages = (req, res) => {
	const chatID = req.params.chatID;
	mySqlConnection.query(
		`delete from messages where chat_id = ${chatID}`,
		(err, rows) => {
			msgToClient = {
				msg: `Chat room number ${chatID} is empty`,
			};
			return res.send(msgToClient);
		}
	);
};

module.exports = {
	getChatMessages,
	createChatMessage,
	deleteChatMessages,
};
