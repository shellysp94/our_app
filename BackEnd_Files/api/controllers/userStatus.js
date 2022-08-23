const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

getUserStatus = (req, res) => {
	const userid = req.params.userid;

	mySqlConnection.query(
		`select * from user_status where user_id = ${userid}`,
		(err, rows) => {
			try {
				res.send(rows);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

updateUserStatus = (req, res) => {
	const userid = req.params.userid;
	const status = req.body.status;

	mySqlConnection.query(
		`insert into user_status (user_id, status_last_update, user_status) values (${userid}, current_timestamp(), "${status}") 
		on duplicate key update user_id = ${userid}, status_last_update = current_timestamp(), user_status = "${status}"`,
		(err, rows) => {
			try {
				if (rows.affectedRows >= 1) {
					getUserStatus(req, res);
				} else {
					res.statusCode = 404;
					res.send(
						"ERROR! Something went wrong! **Post or Update (PUT) user status Request**"
					);
				}
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

module.exports = {
	getUserStatus,
	updateUserStatus,
};
