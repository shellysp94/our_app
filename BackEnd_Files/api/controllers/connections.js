const dbConfig = require("../../config/db_config");
const {
	getUserConfiguration,
	getUserConfigurationInner,
} = require("./userConfiguration");
const mySqlConnection = dbConfig;

function getConnectionsForConfiguration(user, rows, userConnections) {
	const rowsLength = rows.length;

	for (i = 0; i < rowsLength; i++) {
		if (
			!userConnections.includes(rows[i].user_A_id) &&
			rows[i].user_A_id !== parseInt(user, 10)
		) {
			userConnections.push(rows[i].user_A_id);
		} else if (
			!userConnections.includes(rows[i].user_B_id) &&
			rows[i].user_B_id !== parseInt(user, 10)
		) {
			userConnections.push(rows[i].user_B_id);
		}
	}
}

getAllConnections = (req, res) => {
	mySqlConnection.query("SELECT * FROM Connections", (err, rows) => {
		try {
			res.send(rows);
		} catch (err) {
			console.log(err.message);
		}
	});
};

getAllConnectedConnections = (req, res) => {
	mySqlConnection.query(
		"SELECT * FROM Connections WHERE connected = 1",
		(err, rows) => {
			try {
				res.send(rows);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

getUsersConnection = (req, res) => {
	const user_A = req.params.useridA;
	const user_B = req.params.useridB;
	mySqlConnection.query(
		"SELECT * FROM Connections WHERE user_A_id = ? AND user_B_id = ?",
		[user_A, user_B],
		(err, rows) => {
			try {
				res.send(rows);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

getAllUserConnections = (req, res) => {
	const user = req.params.userid;
	mySqlConnection.query(
		"SELECT * FROM Connections WHERE user_A_id = ? OR user_B_id = ?",
		[user, user],
		(err, rows) => {
			try {
				let userConnections = [];
				getConnectionsForConfiguration(user, rows, userConnections);
				let resultArrayToObject = {
					params: {userid: String(userConnections)},
				};
				getUserConfiguration(resultArrayToObject, res);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

getAllUserConnectedConnections = (req, res) => {
	const user = req.params.userid;
	mySqlConnection.query(
		"SELECT * FROM Connections WHERE (user_A_id = ? OR user_B_id = ?) AND connected = 1",
		[user, user],
		(err, rows) => {
			try {
				let userConnectedConnections = [];
				getConnectionsForConfiguration(user, rows, userConnectedConnections);
				let resultArrayToObject = {
					params: {userid: String(userConnectedConnections)},
				};
				getUserConfiguration(resultArrayToObject, res);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

getAllUserConnectionsByName = (req, res) => {
	const user = req.params.userid;
	const connected = req.params.connected;
	let fullName = req.params.name.split(/(\s+)/);
	let firstName, lastName;

	let sqlQuery = `select distinct user_id from user_configuration left join connections on(user_id = user_a_id or user_id = user_b_id)
		where user_id != ${user} and`;

	if (fullName.length > 1) {
		//User try to search first name AND last name.
		firstName = fullName[0];
		lastName = fullName[2];
		//console.log("first name:", firstName, "last name:", lastName);
		sqlQuery = sqlQuery.concat(
			` (first_name like "${firstName}%" and last_name like "${lastName}%")`
		);
	} else {
		sqlQuery = sqlQuery.concat(
			` (first_name like "${fullName[0]}%" or last_name like "${fullName[0]}%")`
		);
	}

	if (parseInt(connected, 10) === 1) {
		sqlQuery = sqlQuery.concat(
			` and (user_a_id = ${user} or user_b_id = ${user}) and connected = 1`
		);
	}

	mySqlConnection.query(sqlQuery, (err, rows) => {
		try {
			if (typeof rows !== "undefined") {
				if (rows.length === 0) {
					msgToClient = {
						msg: `There are no suitable connections`,
					};
					return res.send(msgToClient);
				} else {
					let connectionsByName = [];
					for (i = 0; i < rows.length; i++) {
						connectionsByName.push(rows[i].user_id);
					}

					let resultArrayToObject = {
						params: {
							userid: String(user),
							type: String(connected),
							usersToPresent: connectionsByName,
						},
					};
					getAllUserConnectionsType(resultArrayToObject, res);
				}
			} else {
				msgToClient = {
					msg: `There are no suitable connections`,
				};
				return res.send(msgToClient);
			}
		} catch (err) {
			console.log(err.message);
		}
	});
};

getAllUserConnectionsType = (req, res) => {
	const userid = req.params.userid;
	const type = req.params.type;
	const usersToPresent = req.params.usersToPresent;
	let usersConfigurations = [];
	let mergeObjects = [];

	mySqlConnection.query(
		`select distinct user_id, 
				if((user_a_id = ${userid} or user_b_id = ${userid}) and connected = 1, 1, 0) mutualConnections,
				if(user_a_id = ${userid} and connected = 0, 1, 0) requestsUserSent,
				if(user_b_id = ${userid} and connected = 0, 1, 0) requestsUserReceived, 
				if((user_a_id != ${userid} and user_b_id != ${userid}) or (user_a_id is null and user_b_id is null), 1, 0) notConnected
			from connections right join user_configuration on(user_id = user_a_id or user_id = user_b_id) 
			group by (user_id) having user_id != ${userid}`,
		(err, rows) => {
			try {
				if (parseInt(usersToPresent[0], 10) === 0) {
					// user asked for all other users
					for (user = 0; user < rows.length; user++) {
						usersConfigurations.push(rows[user].user_id);
					}
				} else {
					// user asked for a specific users
					for (user = 0; user < rows.length; user++) {
						if (usersToPresent.includes(rows[user].user_id)) {
							usersConfigurations.push(rows[user].user_id);
						}
					}
				}

				let resultArrayToObject = {
					params: {userid: String(usersConfigurations)},
				};
				// console.log(
				// 	"which users to sent the inner get user configuration:",
				// 	usersConfigurations
				// );
				// console.log("-------The result from the ugly query:-------\n" + rows);
				getUserConfigurationInner(
					resultArrayToObject,
					userid,
					(resultFromConfiguration) => {
						for (user = 0; user < resultFromConfiguration.length; user++) {
							for (row = 0; row < rows.length; row++) {
								if (
									parseInt(resultFromConfiguration[user].user_id, 10) ===
									parseInt(rows[row].user_id, 10)
								) {
									if (parseInt(type, 10) === 1) {
										// user asked for his friends/requests only
										if (parseInt(rows[row].notConnected, 10) === 0) {
											mergeObjects.push(
												Object.assign(
													{},
													resultFromConfiguration[user],
													rows[row]
												)
											);
										}
									} else {
										// user asked for all users in db
										mergeObjects.push(
											Object.assign(
												{},
												resultFromConfiguration[user],
												rows[row]
											)
										);
									}
								}
							}
						}
						res.send(mergeObjects);
					}
				);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

createUsersConnection = (req, res) => {
	const user_A = req.params.useridA;
	const user_B = req.params.useridB;

	mySqlConnection.query(
		`
		select * from connections where (user_A_id = ${user_B} and user_B_id = ${user_A}) or (((user_A_id = ${user_A} and user_B_id = ${user_B})) and connected = 1)`,
		(err, rows) => {
			try {
				if (rows.length > 0) {
					mySqlConnection.query(
						`
					update connections set connected = 1 where (user_A_id = ${user_B} and user_B_id = ${user_A})`,
						(err, rows) => {
							try {
								msgToClient = {
									msg: `Congrats! there is mutual connection between users ${user_A} and ${user_B}! Would you like starting a new chat?`,
								};
								return res.send(msgToClient);
							} catch (err) {
								console.log(err.message);
							}
						}
					);
				} else {
					mySqlConnection.query(
						`
					insert into connections (user_a_id, user_b_id, creation_date, last_update) values
					(${user_A}, ${user_B}, curdate(), curdate())`,
						(err, rows) => {
							try {
								msgToClient = {
									msg: `Not mutual connection between users ${user_A} and ${user_B} is now exists.`,
								};
								return res.send(msgToClient);
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

deleteUsersConnection = (req, res) => {
	const user_A = req.params.useridA;
	const user_B = req.params.useridB;

	mySqlConnection.query(
		`
		delete from connections where ((user_a_id = ${user_A} and user_b_id = ${user_B}) or (user_a_id = ${user_B} and user_b_id = ${user_A}))`,
		(err, rows) => {
			try {
				msgToClient = {
					msg: `There is no longer connection between users ${user_A} and ${user_B}`,
				};
				return res.send(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

module.exports = {
	getAllConnections: getAllConnections,
	getAllConnectedConnections: getAllUserConnectedConnections,
	getUsersConnection: getUsersConnection,
	getAllUserConnections: getAllUserConnections,
	getAllUserConnectedConnections: getAllUserConnectedConnections,
	getAllUserConnectionsByName: getAllUserConnectionsByName,
	getAllUserConnectionsType: getAllUserConnectionsType,
	createUsersConnection: createUsersConnection,
	deleteUsersConnection: deleteUsersConnection,
};
