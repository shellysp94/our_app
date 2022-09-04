const {app, jwt} = require("../../app");
const dbConfig = require("../../config/db_config");
//var configuration = require("./userConfiguration");
const {createUserConfiguration} = require("./userConfiguration");
const publicToken = require("../../config/auth_config");
const bcrypt = require("bcrypt");
const {response} = require("express");
const mySqlConnection = dbConfig;

function updateDevicetoken(user_id_from_query, device_token, userCred, cb) {
	mySqlConnection.query(
		`insert into Device_token (user_id, device_token) values (${user_id_from_query},"${device_token}")
	ON duplicate key update user_id=${user_id_from_query},device_token="${device_token}"`,
		(err, rows) => {
			try {
				if (rows.affectedRows >= 1) {
					return cb(userCred);
				} else {
					return new Error("updated device token - error");
				}
			} catch (err) {
				logger.error("updated device token - error", {err});
				//console.log(err.message);
			}
		}
	);
}

login = async (req, res) => {
	// Read username and password from request body
	const email = req.body.email;
	const password = req.body.password;

	mySqlConnection.query(
		"SELECT* from Users WHERE email=?",
		[email],
		(err, rows) => {
			if (rows.length === 0) {
				// user not exist
				msgToClient = {msg: "user not exist"};
				return res.send(msgToClient);
			} else {
				//user exist
				var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
				var dbPass = resultArray[0].password;

				var user_id_from_query = resultArray[0].user_id;

				bcrypt.compare(password, dbPass, (err, result) => {
					try {
						if (result) {
							const accessToken = jwt.sign(
								{user_id: resultArray[0].user_id},
								publicToken,
								{expiresIn: "365d"}
							);

							const userCred = {
								user_id: resultArray[0].user_id,
								email: email,
								token: accessToken,
							};

							mySqlConnection.query(
								"UPDATE Users SET token=? WHERE email=?",
								[accessToken, email],
								(err, results) => {
									try {
										mySqlConnection.query(
											`select * 
										from Users a
										right join Device_token b
										on a.user_id = b.user_id
										where a.email = "${email}"`,
											(err, rows) => {
												try {
													updateDevicetoken(
														user_id_from_query,
														req.body.device_token,
														userCred,
														(response) => {
															res.send(response);
														}
													);
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
							msgToClient = {msg: "Incorrect password"};
							return res.send(msgToClient);
						}
					} catch (err) {
						console.log(err.message);
					}
				});
			}
		}
	);
};

register = (req, res) => {
	mySqlConnection.query(
		"SELECT* from Users WHERE email=?",
		[req.body.email],
		async (err, rows) => {
			try {
				if (rows.length > 0) {
					msgToClient = {msg: "This email already in use"};
					return res.send(msgToClient);
				}

				let hashedPassword = await bcrypt.hash(req.body.password, 10);
				mySqlConnection.query(
					"INSERT INTO Users SET ?",
					{email: req.body.email, password: hashedPassword},
					(err, results) => {
						try {
							createUserConfiguration(req, res);
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
};

verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) {
		return res.status(401).send("No token sent");
	}

	jwt.verify(token, publicToken, (err, payload) => {
		if (err) {
			return res.status(401).send("Not valid token");
		} //valid token
		else {
			const user_id = req.params.userid || req.params.useridA;
			mySqlConnection.query(
				`select token from users where user_id = ${user_id}`,
				(err, rows) => {
					try {
						if (rows.length === 0 || rows[0].token !== token) {
							//valid token but not token of user request
							return res.status(401).send("Not valid token");
						}
						req.payload = payload;
						next();
					} catch (err) {
						console.log(err.message);
					}
				}
			);
		}
	});
};

module.exports = {
	login,
	register,
	verifyToken,
};
