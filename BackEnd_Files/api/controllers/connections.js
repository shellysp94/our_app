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
	deleteUsersConnection: deleteUsersConnection,
};
