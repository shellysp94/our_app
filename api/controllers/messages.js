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
	const chatID = req.param.chatID;
	const sender = req.param.sender;
	const receiver = req.param.receiver;
	const content = req.body.content;

	mySqlConnection.query(
		`insert into messages (chat_id, create_date, sender_user_id, receiver_user_id, content) values (${chatID}, curdate(), ${sender}, ${receiver}, ${content})`,
		(err, rows) => {
			try {
				res.send(rows);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

module.exports = {
	getChatMessages,
	createChatMessage,
};

// createMessage = (req, res) => {
// 	const userid = req.params.userid;

// 	mySqlConnection.query(
// 		"delete from Filters where user_id = ?",
// 		[userid],
// 		(err, result) => {
// 			try {
// 				msgToClient = {
// 					msg: `User number ${userid} filter deleted successfully`,
// 				};
// 				return res.send(msgToClient);
// 			} catch (err) {
// 				console.log(err.message);
// 			}
// 		}
// 	);
// };
