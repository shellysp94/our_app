const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

statusInsertDefaultRow = (userid) => {
	return new Promise((resolve, reject) => {
		if (parseInt(userid, 10) <= 0) {
			reject(
				`Something wrong! Status default row for a new user didn't added successfully`
			);
		} else {
			mySqlConnection.query(
				`insert into user_status (user_id, status_last_update) values (${userid}, current_timestamp())`,
				(err, rows) => {
					try {
						if (rows.affectedRows >= 1) {
							resolve(`and User Status`);
						}
					} catch (err) {
						reject(
							`Something wrong! Status default row for a new user didn't added successfully\nError message: `,
							err.message
						);
					}
				}
			);
		}
	});
};

getUserStatus = (req, res) => {
	const userid = req.params.userid;

	mySqlConnection.query(
		`select * from user_status where user_id = ${userid}`,
		(err, rows) => {
			try {
				res.send(rows[0]);
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
	statusInsertDefaultRow,
};
