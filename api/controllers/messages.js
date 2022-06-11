const dbConfig = require("../../config/db_config");
const chatRoomsArray = require("../../chatRooms/chatRoomsArray");
const mySqlConnection = dbConfig;
const chatRooms = new chatRoomsArray().getInstance();

getChatMessages = (req, res) => {
	const chatID = req.params.chatID;
	const messagesOffset = req.params.messagesOffset;

	mySqlConnection.query(
		`select * from messages where chat_id = ${chatID} order by create_day desc, create_time desc limit 50 offset ${messagesOffset}`,
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
	const chatID = req.params.chatID;
	const sender = req.params.sender;
	const receiver = req.params.receiver;
	const content = req.body.content;

	console.log("honey im here! (create message)");
	console.log(chatRooms);

	mySqlConnection.query(
		`insert into messages (chat_id, create_day, create_time, sender_user_id, receiver_user_id, content) values (${chatID}, curdate(), time(now()), ${sender}, ${receiver}, "${content}")`,
		(err, rows) => {
			try {
				mySqlConnection.query(
					`select * from messages where chat_id = ${chatID} order by create_day desc, create_time desc limit 1`,
					(err, rows) => {
						if (typeof rows === "undefined" || rows.length === 0) {
							msgToClient = {
								msg: `Something went wrong! Message did not add.`,
							};
							return res.send(msgToClient);
						} else {
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
