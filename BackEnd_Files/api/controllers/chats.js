const dbConfig = require("../../config/db_config");
const {getUserConfigurationInner} = require("./userConfiguration");
const {getChatMessages, deleteChatMessages} = require("./messages");
const chatRoomsArray = require("../../utils/chatRooms/chatRoomsArray");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const onlineUsers = new onlineUsersArray().getInstance();
const chatRooms = new chatRoomsArray().getInstance();
const mySqlConnection = dbConfig;
const {infoLogger, errLogger} = require("../../utils/logger");

getAllChats = (req, res) => {
	infoLogger.info("This is an info log");
	mySqlConnection.query("SELECT * from Chats", (err, rows) => {
		try {
			if (err) {
				throw new Error("Chat - GET MySQL Error");
			} else {
				res.send(rows);
			}
		} catch (err) {
			errLogger.error("Chats", {err});
			return res.status(500).send("internal error");
		}
	});
};

getSpecificUserChats = (req, res) => {
	infoLogger.info("This is an info log");
	const userid = req.params.userid;
	let mergeObjects = [];

	mySqlConnection.query(
		`select user_A_id, user_B_id from Chats where user_A_id = ${userid} or user_B_id = ${userid}`,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error(
						"Chats - GET (specific user's chat rooms) - select user's chats from DB failed, MySQL Error"
					);
				} else {
					if (rows.length > 0) {
						let openChatUsers = [];
						for (let user = 0; user < rows.length; user++) {
							if (parseInt(rows[user].user_A_id, 10) !== parseInt(userid, 10)) {
								openChatUsers.push(parseInt(rows[user].user_A_id, 10));
							} else {
								openChatUsers.push(parseInt(rows[user].user_B_id, 10));
							}
						}
						let resultArrayToObject = {
							params: {userid: String(openChatUsers)},
						};
						getUserConfigurationInner(
							resultArrayToObject,
							userid,
							(relevantUsersConfiguration) => {
								try {
									if (relevantUsersConfiguration === undefined) {
										throw new Error(
											"Chats - GET Specific User's Chat rooms - Get User Configuration Inner FAILED"
										);
									} else {
										// get the last message in a specific chat to display
										for (
											let relevant = 0;
											relevant < relevantUsersConfiguration.length;
											relevant++
										) {
											mySqlConnection.query(
												`select * from Messages where
								(sender_user_id = ${userid} and receiver_user_id = ${relevantUsersConfiguration[relevant].user_id}) or
								(sender_user_id = ${relevantUsersConfiguration[relevant].user_id} and receiver_user_id = ${userid})
								order by creation_date desc limit 1`,
												(err, rows) => {
													try {
														if (err || rows === undefined) {
															throw new Error(
																"Chats - Get specific user's chat rooms\nSelect messages from the chat rooms (loop for all the chats of this user) - one of them FAILED"
															);
														} else {
															if (rows.length > 0) {
																for (user = 0; user < rows.length; user++) {
																	if (
																		parseInt(
																			relevantUsersConfiguration[relevant]
																				.user_id,
																			10
																		) ===
																			parseInt(rows[user].sender_user_id, 10) ||
																		parseInt(
																			relevantUsersConfiguration[relevant]
																				.user_id,
																			10
																		) ===
																			parseInt(rows[user].receiver_user_id, 10)
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

															if (
																relevant + 1 ===
																relevantUsersConfiguration.length
															) {
																res.send(mergeObjects);
															}
														}
													} catch (err) {
														errLogger.error({err});
														return res.status(500).send("internal error");
													}
												}
											);
										}
									}
								} catch (err) {
									errLogger.error({err});
									return res.status(500).send("internal error");
								}
							}
						);
					} else {
						res.send(rows);
					}
				}
			} catch (err) {
				errLogger.error({err});
				return res.status(500).send("internal error");
			}
		}
	);
};

getUsersChat = (req, res) => {
	infoLogger.info("This is an info log");
	const userIdA = req.params.useridA;
	const userIdB = req.params.useridB;
	const messagesOffset = req.params.offset;

	mySqlConnection.query(
		"SELECT * FROM Chats WHERE (user_A_id = ? AND user_B_id = ?) OR (user_A_id = ? AND user_B_id = ?)",
		[userIdA, userIdB, userIdB, userIdA],
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error("Chats - GET from Chats - MySQL Error");
				} else {
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

						getChatMessages(desiredChatRoom, (response) => {
							if (response !== undefined) {
								res.send(response);
							} else {
								errLogger.error("Messages", {err});
								return res.status(500).send("internal error");
							}
						});
					}
				}
			} catch (err) {
				errLogger.error("Chats", {err});
				return res.status(500).send("internal error");
			}
		}
	);
};

createUsersChat = (req, res) => {
	infoLogger.info("This is an info log");
	const userIdA = req.params.useridA;
	const userIdB = req.params.useridB;

	mySqlConnection.query(
		`select chat_id from Chats where (user_A_id = ${userIdA} and user_B_id = ${userIdB}) or (user_A_id = ${userIdB} and user_B_id = ${userIdA})`,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error(
						"Chats - UPDATE || INSERT to DB - MySQL syntax Error"
					);
				} else {
					if (rows.length === 0) {
						// there is no chat of these users --> should create a new chat for them.
						mySqlConnection.query(
							`select * from Connections 
							where (((user_A_id = ${userIdA} and user_B_id = ${userIdB}) or (user_A_id = ${userIdB} and user_B_id = ${userIdA})) 
							and connected = 1)`,
							(err, rows) => {
								try {
									if (err || rows === undefined) {
										throw new Error(
											"Chats - UPDATE || INSERT to DB - MySQL syntax Error"
										);
									} else {
										if (rows.length > 0) {
											mySqlConnection.query(
												`insert into Chats (create_date, last_login, user_A_id, user_B_id) values (curdate(), curdate(), ${userIdA}, ${userIdB})`,
												(err, rows) => {
													try {
														if (
															err ||
															rows === undefined ||
															rows.affectedRows < 1
														) {
															throw new Error(
																"Chats - UPDATE || INSERT to DB - MySQL syntax Error"
															);
														} else {
															mySqlConnection.query(
																`select chat_id from Chats where user_A_id = ${userIdA} and user_B_id = ${userIdB}`,
																(err, rows) => {
																	try {
																		chatRooms.insertNewChatRoom(
																			rows[0].chat_id,
																			parseInt(userIdA, 10),
																			parseInt(userIdB, 10)
																		);
																		const currentChatRoom =
																			chatRooms.getChatRoom(rows[0].chat_id);

																		infoLogger.info(
																			`create a new chat\nchat id = ${rows[0].chat_id} between users: ${userIdA} and ${userIdB}`
																		);

																		if (onlineUsers.includesAUser(userIdA)) {
																			onlineUsers.updateChatRoomOfUser(
																				userIdA,
																				currentChatRoom
																			);
																			infoLogger.info(
																				`user id ${userIdA} chat rooms are now:\n${JSON.stringify(
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
																			infoLogger.info(
																				`user id ${userIdB} chat rooms are now:\n${JSON.stringify(
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
																		throw new Error(
																			"create a new chat - ERROR"
																		);
																	}
																}
															);
														}
													} catch (err) {
														errLogger.error("Chats", {err});
														return res.status(500).send("internal error");
													}
												}
											);
										} else {
											msgToClient = {
												msg: `Chat not added. There is no mutual connection between users ${userIdA} and ${userIdB}.`,
											};
											return res.send(msgToClient);
										}
									}
								} catch (err) {
									errLogger.error("Chats", {err});
									return res.status(500).send("internal error");
								}
							}
						);
					} else {
						const chatID = rows[0].chat_id;
						mySqlConnection.query(
							`update Chats set last_login = curdate() where chat_id = ${chatID}`,
							(err, rows) => {
								try {
									if (err || rows === undefined || rows.affectedRows < 1) {
										throw new Error(
											"Chats - UPDATE || INSERT to DB - MySQL syntax Error"
										);
									} else {
										infoLogger.info(
											"im from updating\nchat rooms in DB are:",
											chatRooms
										);
										let desiredChatRoom = {
											params: {
												chatID: String(chatID),
												messagesOffset: String(0),
											},
										};

										getChatMessages(desiredChatRoom, (response) => {
											if (response !== undefined) {
												res.send(response);
											} else {
												errLogger.error("Messages", {err});
												return res.status(500).send("internal error");
											}
										});
									}
								} catch (err) {
									errLogger.error("Chats", {err});
									return res.status(500).send("internal error");
								}
							}
						);
					}
				}
			} catch (err) {
				errLogger.error("Chats", {err});
				return res.status(500).send("internal error");
			}
		}
	);
};

deleteUsersChat = (req, res) => {
	infoLogger.info("This is an info log");
	const userIdA = req.params.useridA;
	const userIdB = req.params.useridB;

	mySqlConnection.query(
		`select chat_id from Chats where (user_A_id = ${userIdA} and user_B_id = ${userIdB})
					or (user_A_id = ${userIdB} and user_B_id = ${userIdA})`,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error(
						"Chat - DELETE (select the chat to delete failed) MySQL Error"
					);
				} else {
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

						deleteChatMessages(desiredChatRoom, (response) => {
							if (response !== undefined) {
								res.send(response);
							} else {
								errLogger.error("Messages - DELETE MySQL Error");
								return res.status(500).send("internal error");
							}
						});
					}
				}
			} catch (err) {
				errLogger.error("Chats", {err});
				return res.status(500).send("internal error");
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
