const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

module.exports = {
	getAllNotifications: (req, res) => {
		mySqlConnection.query("SELECT * from Notifications", (err, rows) => {
			try {
				res.send(rows);
			} catch (err) {
				console.log(err.message);
			}
		});
	},

	getUserNotifications: (req, res) => {
		const userid = req.params.userid;
		mySqlConnection.query(
			"SELECT * FROM Notifications WHERE user_id = ?",
			[userid],
			(err, rows) => {
				try {
					res.send(rows);
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	},

	getUserUnseenNotifications: (req, res) => {
		const userid = req.params.userid;
		mySqlConnection.query(
			"SELECT * FROM Notifications WHERE user_id = ? and seen = 0",
			[userid],
			(err, rows) => {
				try {
					res.send(rows);
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	},

	updateSeenStatusNotification: (req, res) => {
		notification_id = req.params.notification_id;
		mySqlConnection.query(`UPDATE notifications SET seen = 1 WHERE notification_id = ${notification_id}`, (err,rows) =>
		{
			try
			{
				res.send(`notification id ${notification_id} seen`);
			}
			catch(err)
			{
				console.log(err.message);
			}
		})
		
	},

	deleteUserSeenNotifications: (req, res) => {
		const userid = req.params.userid;
		mySqlConnection.query(
			"DELETE FROM Notifications WHERE user_id = ? and seen = 1",
			[userid],
			(err, result) => {
				try {
					msgToClient = {
						msg: `All user ${userid} seen notifications deleted successfully`,
					};
					return res.send(msgToClient);
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	},

	createUserNotification: (req,cb) =>
	{
		sqlQuery = `insert into notifications (notification_id, user_id, content, title, creation_date) values (${req.body.notification_id},${req.body.user_id},'${req.body.content}','${req.body.title}',CURRENT_TIMESTAMP())`;

		mySqlConnection.query(sqlQuery, (err,rows) =>
		{
			try
			{
				cb(`${req.body.title} sent`);
			}

			catch(err)
			{
				console.log(err);
			}
		});
	}
};
