const dbConfig = require("../../config/db_config");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const mySqlConnection = dbConfig;
const onlineUsers = new onlineUsersArray().getInstance();

getChatMessages = (req, res) => {
	const chatID = req.params.chatID;
	const messagesOffset = req.params.messagesOffset;

	mySqlConnection.query(
		`select * from (select * from messages where chat_id = ${chatID} limit 50 offset ${messagesOffset}) as T1 order by create_day desc, create_time desc`,
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
		`insert into messages (chat_id, create_day, create_time, sender_user_id, receiver_user_id, content) values (${chatID}, curdate(), time(now()), ${sender}, ${receiver}, "${content}")`,
		(err, rows) => {
			try {
				mySqlConnection.query(
					`select * from messages where chat_id = ${chatID} order by create_day desc, create_time desc limit 1`,
					(err, rows) => {
						if (typeof rows === "undefined" || rows.length === 0) {
							msgToClient = {
								msg: `Something went wrong! Message don't added and don't sent.`,
							};
							return res.send(msgToClient);
						} else {
							// message from sender to receiver in their chat room insert to the database
							// need to send the message to these users (sender and receiver)
							if (typeof receiverOnlineUser !== "undefined") {
								// sender and receiver are online - should send each of them the message in their chat room
								senderOnlineUser.websocket.send(content);
								receiverOnlineUser.websocket.send(content);
							} else {
								// message from sender to receiver insert to the database and save in the relevant chat room
								// but the receiver is offline now, so should send notification to the receiver that he has a new message!
								senderOnlineUser.websocket.send(content);
								console.log(
									`user number ${sender} sent a message to user number ${receiver}.\n the message it's: "${content}"`
								);
							}
							res.send(rows);
						}
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
