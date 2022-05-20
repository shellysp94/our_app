const dbConfig = require("../../config/db_config");
const {getChatMessages, deleteChatMessages} = require("./messages");
const mySqlConnection = dbConfig;

module.exports = {
	getAllChats: (req, res) => {
		mySqlConnection.query("SELECT * from Chats", (err, rows) => {
			try {
				res.send(rows);
			} catch (err) {
				console.log(err.message);
			}
		});
	},

	getUsersChat: (req, res) => {
		const userIdA = req.params.useridA;
		const userIdB = req.params.useridB;
		mySqlConnection.query(
			"SELECT * FROM Chats WHERE (user_A_id = ? AND user_B_id = ?) OR (user_A_id = ? AND user_B_id = ?)",
			[userIdA, userIdB, userIdB, userIdA],
			(err, rows) => {
				try {
					if (rows.length === 0) {
						msgToClient = {
							msg: `There is no chat between these two users`,
						};
						return res.send(msgToClient);
					} else {
						const chatID = rows[0].chat_id;
						//console.log("the chat id:", chatID);
						let desiredChatRoom = {
							params: {
								chatID: String(chatID),
								messagesOffset: String(0),
							},
						};
						//console.log("for messages:", desiredChatRoom);
						getChatMessages(desiredChatRoom, res);
					}
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	},

	createUsersChat: (req, res) => {
		const currentDate = new Date();
		const lastLogin = new Date();
		const userIdA = req.params.useridA;
		const userIdB = req.params.useridB;

		mySqlConnection.query(
			`select chat_id from chats where (user_A_id = ${userIdA} and user_B_id = ${userIdB}) or (user_A_id = ${userIdB} and user_B_id = ${userIdA})`,
			(err, rows) => {
				try {
					if (rows.length === 0) {
						// there is no chat of these users --> should create a new chat for them.
						mySqlConnection.query(
							`select * from connections where (user_A_id = ${userIdA} and user_B_id = ${userIdB} and connected = 1)`,
							(err, rows) => {
								try {
									if (rows.length > 0) {
										mySqlConnection.query(
											`insert into chats (create_date, last_login, user_A_id, user_B_id) values (curdate(), curdate(), ${userIdA}, ${userIdB})`,
											(err, rows) => {
												try {
													mySqlConnection.query(
														`select first_name from user_configuration where user_id = ${userIdA} or user_id = ${userIdB}`,
														(err, rows) => {
															try {
																const user_A_Name = rows[0].first_name;
																const user_B_Name = rows[1].first_name;
																msgToClient = {
																	msg: `Chat between ${user_A_Name} and ${user_B_Name} is now exists, lets talk!`,
																};
																return res.send(msgToClient);
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
									} else {
										msgToClient = {
											msg: `Chat not added. There is no mutual connection between users ${userIdA} and ${userIdB}.`,
										};
										return res.send(msgToClient);
									}
								} catch (err) {
									console.log(err.message);
								}
							}
						);
					} else {
						const chatID = rows[0].chat_id;
						mySqlConnection.query(
							`update chats set last_login = curdate() where chat_id = ${chatID}`,
							(err, rows) => {
								try {
									let desiredChatRoom = {
										params: {
											chatID: String(chatID),
											messagesOffset: String(0),
										},
									};
									getChatMessages(desiredChatRoom, res);
								} catch (err) {
									console.log(err.message);
								}
							}
						);
					}
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	},

	deleteUsersChat: (req, res) => {
		const userIdA = req.params.useridA;
		const userIdB = req.params.useridB;

		// mySqlConnection.query(
		// 	"DELETE FROM Chats WHERE user_A_id = ? AND user_B_id = ?",
		// 	[userIdA, userIdB],
		// 	(err, rows) => {
		// 		try {
		mySqlConnection.query(
			`select chat_id from chats where (user_a_id = ${userIdA} and user_b_id = ${userIdB})
						or (user_a_id = ${userIdB} and user_b_id = ${userIdA})`,
			(err, rows) => {
				try {
					if (rows.length === 0) {
						msgToClient = {
							msg: `Chat was not exist`,
						};
						return res.send(msgToClient);
					} else {
						const chatID = rows[0].chat_id;
						let desiredChatRoom = {
							params: {
								chatID: String(chatID),
							},
						};
						deleteChatMessages(desiredChatRoom, res);
					}
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	},
};
