const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

module.exports = {
	getAllUsers: (req, res) => {
		mySqlConnection.query("SELECT* from users", (err, rows) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		});
	},

	getOneUser: (req, res) => {
		//mySqlConnection.query("SELECT * from users WHERE user_id= ?",[req.params.userid], (err,rows)=>{
		const arr = req.params.userid.split(",");
		mySqlConnection.query(
			"SELECT * from users WHERE user_id IN (?)",
			[arr],
			(err, rows) => {
				if (!err) {
					res.send(rows);
				} else {
					console.log(err);
				}
			}
		);
	},

	getUsersByRadius: (req, res) => {
		let radius = req.params.radius;
		mySqlConnection.query(
			"SELECT user_id, ( 3959 * acos ( cos ( radians(31.589167) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(64.363333) ) + sin ( radians(31.589167) ) * sin( radians( latitude ) ) ) ) AS distance FROM user_configuration HAVING (distance < 1000)",
			(err, rows) => {
				if (!err) {
					res.send(rows);
				} else {
					console.log(err);
				}
			}
		);
	},

	deleteUser: (req, res) => {
		mySqlConnection.query(
			"DELETE FROM users WHERE user_id=?",
			req.params.userid,
			(err, resuls) => {
				if (!err) {
					res.send("user deleted successfully");
				} else {
					console.log(err);
				}
			}
		);
	},
	updateUser: (req, res) => {
		let user_id = req.params.userid;
		let email = req.body.email;

		let hashedPassword = bcrypt.hash(req.body.password, 10);

		mySqlConnection.query(
			"UPDATE users SET email=?, password=? WHERE user_id=?",
			[email, hashedPassword, user_id],
			(err, result) => {
				if (!err) {
					res.send("user updated successfully");
				} else {
					console.log(err);
				}
			}
		);
	},
};
