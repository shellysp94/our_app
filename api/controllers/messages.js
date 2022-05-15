const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

getChatMessages = (req, res) => {
	const chatID = req.params.chatID;
	const messagesOffset = req.params.messagesOffset;

	mySqlConnection.query(
		`select * from messages where chat_id = ${chatID} order by create_date asc limit 50 offset ${messagesOffset}`,
		(err, rows) => {
			try {
				res.send(rows);
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

	mySqlConnection.query(
		`insert into messages (chat_id, create_date, sender_user_id, receiver_user_id, content) values (${chatID}, curdate(), ${sender}, ${receiver}, "${content}")`,
		(err, rows) => {
			try {
				msgToClient = {
					msg: `message for chat room number: ${chatID} created`,
				};
				return res.send(msgToClient);
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
