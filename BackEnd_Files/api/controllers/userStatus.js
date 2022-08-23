const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

// CREATE TABLE user_status (
// 	user_id int not null,
// 	last_update datetime not null,
// 	content varchar(50) default null,
// 	foreign key (user_id) references Users (user_id)
// ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

getUserStatus = (req, res) => {
	const userid = req.params.userid;

	mySqlConnection.query(
		`select * from user_configuration UC right join user_status US using(user_id) where UC.user_id = ${userid}`,
		(err, rows) => {
			try {
				return res.send(rows);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

createOrUpdateUserStatus = (req, res) => {
	const userid = req.params.userid;
	const content = req.body.content;

	mySqlConnection.query(
		`insert into user_status (user_id, last_update, content) values (${userid}, current_timestamp(), "${content}") 
	on duplicate key update user_id = ${userid}, last_update = current_timestamp(), content = "${content}"`,
		(err, rows) => {
			try {
				///////////////////// check what's happened when I insert the status????
				if (rows !== undefined && rows.length > 0) {
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

deleteUserStatus = (req, res) => {
	const userid = req.params.userid;

	mySqlConnection.query(
		`update (last_update, content) on user_status where user_id = ${userid} values 
	(last_update = current_timestamp(), content = "")`,
		(err, rows) => {
			try {
				//Same as post ??? Or just return a message that the status is now an empty string ???
			} catch (err) {
				console.log(err);
			}
		}
	);
};

module.exports = {
	getUserStatus,
	createOrUpdateUserStatus,
	deleteUserStatus,
};
