const dbConfig = require("../../config/db_config");
const {getUserConfiguration} = require("./userConfiguration");
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

module.exports = {
	getAllConnections: (req, res) => {
		mySqlConnection.query("SELECT * FROM Connections", (err, rows) => {
			try {
				res.send(rows);
			} catch (err) {
				console.log(err.message);
			}
		});
	},

	getAllConnectedConnections: (req, res) => {
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
	},

	getUsersConnection: (req, res) => {
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
	},

	getAllUserConnections: (req, res) => {
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
	},

	getAllUserConnectedConnections: (req, res) => {
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
	},

	getAllUserConnectionsByName: (req, res) => {
		const user = req.params.userid;
		const connected = req.params.connected;
		let fullName = req.body.name.split(/(\s+)/);
		let firstName = fullName[0];
		let lastName = fullName[2];

		if (typeof lastName === "undefined") {
			lastName = "";
		}
		//console.log("first name:", firstName, "last name:", lastName);

		let sqlQuery = `select distinct user_id from user_configuration right join connections on(user_id = user_a_id or user_id = user_b_id)
		where first_name like "${firstName}%" and last_name like "${lastName}%" and user_id != ${user}`;

		if (parseInt(connected, 10) === 1) {
			sqlQuery = sqlQuery.concat(` and connected = 1`);
		}

		mySqlConnection.query(sqlQuery, (err, rows) => {
			try {
				let connectionsByName = [];
				for (i = 0; i < rows.length; i++) {
					connectionsByName.push(rows[i].user_id);
				}
				let resultArrayToObject = {
					params: {userid: String(connectionsByName)},
				};
				getUserConfiguration(resultArrayToObject, res);
			} catch (err) {
				console.log(err.message);
			}
		});
	},

	createUsersConnection: (req, res) => {
		const creationDate = new Date();
		const lastUpdate = new Date();
		const user_A = req.params.useridA;
		const user_B = req.params.useridB;

		mySqlConnection.query(
			"INSERT INTO Connections (user_A_id, user_B_id, creation_date, last_update) values (?, ?, ?, ?)" +
				"ON DUPLICATE KEY UPDATE user_A_id = ?, user_B_id = ?, last_update = ?",
			[user_A, user_B, creationDate, lastUpdate, user_A, user_B, lastUpdate],
			(err, rows) => {
				try {
					if (typeof rows !== "undefined") {
						// the insert succeed
						mySqlConnection.query(
							`select * from connections where ((user_A_id = ${user_B} and user_B_id = ${user_A}) or 
                (user_A_id = ${user_A} and user_B_id = ${user_B}))`,
							(err, rows) => {
								if (rows.length === 2) {
									mySqlConnection.query(
										`update connections set connected = 1 where 
                          ((user_A_id = ${user_A} and user_B_id = ${user_B}) or
                          (user_A_id = ${user_B} and user_B_id = ${user_A}))`,
										(err, rows) => {
											try {
												mySqlConnection.query(
													`select first_name from user_configuration where user_id = ${user_A} or user_id = ${user_B}`,
													(err, rows) => {
														try {
															const user_A_Name = rows[0].first_name;
															const user_B_Name = rows[1].first_name;
															msgToClient = {
																msg: `Congrats! there is a new mutual connection between ${user_A_Name} and ${user_B_Name}! Would you like starting a new chat?`,
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
									mySqlConnection.query(
										`select first_name from user_configuration where user_id = ${user_A} or user_id = ${user_B}`,
										(err, rows) => {
											try {
												const user_A_Name = rows[0].first_name;
												const user_B_Name = rows[1].first_name;
												msgToClient = {
													msg: `Not mutual Connection between ${user_A_Name} and ${user_B_Name} is now exists.`,
												};
												return res.send(msgToClient);
											} catch (err) {
												console.log(err.message);
											}
										}
									);
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

	deleteUsersConnection: (req, res) => {
		const user_A = req.params.useridA;
		const user_B = req.params.useridB;
		const lastUpdate = new Date();

		mySqlConnection.query(
			"DELETE FROM Connections WHERE user_A_id = ? AND user_B_id = ?",
			[user_A, user_B],
			(err, result) => {
				try {
					mySqlConnection.query(
						`select * from connections where user_A_id = ${user_B} and user_B_id = ${user_A}`,
						(err, rows) => {
							try {
								if (rows.length > 0) {
									mySqlConnection.query(
										`update connections set connected = 0 where
                    user_A_id = ${user_B} and user_B_id = ${user_A}`,
										(err, rows) => {
											try {
												mySqlConnection.query(
													`select first_name from user_configuration where user_id = ${user_A} or user_id = ${user_B}`,
													(err, rows) => {
														try {
															const user_A_Name = rows[0].first_name;
															const user_B_Name = rows[1].first_name;
															msgToClient = {
																msg: `Oh no! There is no longer mutual connection between ${user_A_Name} and ${user_B_Name}`,
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
									mySqlConnection.query(
										`select first_name from user_configuration where user_id = ${user_A} or user_id = ${user_B}`,
										(err, rows) => {
											try {
												const user_A_Name = rows[0].first_name;
												const user_B_Name = rows[1].first_name;
												msgToClient = {
													msg: `Connection between ${user_A_Name} and ${user_B_Name} is no longer exists.`,
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
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	},
};
