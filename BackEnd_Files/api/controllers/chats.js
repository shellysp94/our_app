const dbConfig = require("../../config/db_config");
const {getUserConfigurationInner} = require("./userConfiguration");
const {getChatMessages, deleteChatMessages} = require("./messages");
const chatRoomsArray = require("../../utils/chatRooms/chatRoomsArray");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const onlineUsers = new onlineUsersArray().getInstance();
const chatRooms = new chatRoomsArray().getInstance();
const mySqlConnection = dbConfig;

getAllChats = (req, res) => {
	mySqlConnection.query("SELECT * from Chats", (err, rows) => {
		try {
			res.send(rows);
		} catch (err) {
			console.log(err.message);
		}
	});
};

getSpecificUserChats = (req, res) => {
	const userid = req.params.userid;
	let mergeObjects = [];

	mySqlConnection.query(
		`select user_a_id, user_b_id from chats where user_a_id = ${userid} or user_b_id = ${userid}`,
		(err, rows) => {
			try {
				if (rows !== undefined && rows.length > 0) {
					let openChatUsers = [];
					for (let user = 0; user < rows.length; user++) {
						if (parseInt(rows[user].user_a_id, 10) !== parseInt(userid, 10)) {
							openChatUsers.push(parseInt(rows[user].user_a_id, 10));
						} else {
							openChatUsers.push(parseInt(rows[user].user_b_id, 10));
						}
					}
					let resultArrayToObject = {
						params: {userid: String(openChatUsers)},
					};
					getUserConfigurationInner(
						resultArrayToObject,
						userid,
						(relevantUsersConfiguration) => {
							// get the last message in a specific chat to display
							for (
								let relevant = 0;
								relevant < relevantUsersConfiguration.length;
								relevant++
							) {
								mySqlConnection.query(
									`select * from messages where
								(sender_user_id = ${userid} and receiver_user_id = ${relevantUsersConfiguration[relevant].user_id}) or
								(sender_user_id = ${relevantUsersConfiguration[relevant].user_id} and receiver_user_id = ${userid})
								order by creation_date desc limit 1`,
									(err, rows) => {
										try {
											if (rows !== undefined && rows.length > 0) {
												for (user = 0; user < rows.length; user++) {
													if (
														parseInt(
															relevantUsersConfiguration[relevant].user_id,
															10
														) === parseInt(rows[user].sender_user_id, 10) ||
														parseInt(
															relevantUsersConfiguration[relevant].user_id,
															10
														) === parseInt(rows[user].receiver_user_id, 10)
													) {
														// merging
														mergeObjects.push(
															Object.assign(
																{},
																relevantUsersConfiguration[relevant],
																rows[user]
															)
														);
													}
												}
											} else {
												mergeObjects.push(
													Object.assign(
														{},
														relevantUsersConfiguration[relevant]
													)
												);
											}
											if (relevant + 1 === relevantUsersConfiguration.length) {
												res.send(mergeObjects);
											}
										} catch (err) {
											console.log(err.message);
										}
									}
								);
							}
						}
					);
				} else {
					return res.send(rows);
				}
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

getUsersChat = (req, res) => {
	const userIdA = req.params.useridA;
	const userIdB = req.params.useridB;
	const messagesOffset = req.params.offset;

	mySqlConnection.query(
		"SELECT * FROM Chats WHERE (user_A_id = ? AND user_B_id = ?) OR (user_A_id = ? AND user_B_id = ?)",
		[userIdA, userIdB, userIdB, userIdA],
		(err, rows) => {
			try {
				if (rows.length === 0) {
					return res.send(rows);
				} else {
					const chatID = rows[0].chat_id;
					let desiredChatRoom = {
						params: {
							chatID: String(chatID),
							messagesOffset: String(messagesOffset),
						},
					};
					getChatMessages(desiredChatRoom, res);
				}
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

createUsersChat = (req, res) => {
	const userIdA = req.params.useridA;
	const userIdB = req.params.useridB;

	mySqlConnection.query(
		`select chat_id from chats where (user_A_id = ${userIdA} and user_B_id = ${userIdB}) or (user_A_id = ${userIdB} and user_B_id = ${userIdA})`,
		(err, rows) => {
			try {
				if (rows.length === 0) {
					// there is no chat of these users --> should create a new chat for them.
					mySqlConnection.query(
						`select * from connections 
						where (((user_A_id = ${userIdA} and user_B_id = ${userIdB}) or (user_a_id = ${userIdB} and user_b_id = ${userIdA})) 
						and connected = 1)`,
						(err, rows) => {
							try {
								if (rows.length > 0) {
									mySqlConnection.query(
										`insert into chats (create_date, last_login, user_A_id, user_B_id) values (curdate(), curdate(), ${userIdA}, ${userIdB})`,
										(err, rows) => {
											try {
												mySqlConnection.query(
													`select chat_id from chats where user_A_id = ${userIdA} and user_B_id = ${userIdB}`,
													(err, rows) => {
														try {
															chatRooms.insertNewChatRoom(
																rows[0].chat_id,
																parseInt(userIdA, 10),
																parseInt(userIdB, 10)
															);
															const currentChatRoom = chatRooms.getChatRoom(
																rows[0].chat_id
															);

															console.log("create a new chat -->");

															if (onlineUsers.includesAUser(userIdA)) {
																onlineUsers.updateChatRoomOfUser(
																	userIdA,
																	currentChatRoom
																);

																console.log(
																	`user id ${userIdA} chat rooms:\n${JSON.stringify(
																		onlineUsers
																			.getOnlineUser(userIdA)
																			.getAllUserChatRooms()
																	)}`
																);
															}

															if (onlineUsers.includesAUser(userIdB)) {
																onlineUsers.updateChatRoomOfUser(
																	userIdB,
																	currentChatRoom
																);

																console.log(
																	`user id ${userIdB} chat rooms:\n${JSON.stringify(
																		onlineUsers
																			.getOnlineUser(userIdB)
																			.getAllUserChatRooms()
																	)}`
																);
															}

															msgToClient = {
																msg: `Chat room between users ${userIdA} and ${userIdB} created.`,
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
								console.log("im from updating", chatRooms);
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
};

deleteUsersChat = (req, res) => {
	const userIdA = req.params.useridA;
	const userIdB = req.params.useridB;

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
};

module.exports = {
	getAllChats,
	getSpecificUserChats,
	getUsersChat,
	createUsersChat,
	deleteUsersChat,
};
