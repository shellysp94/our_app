const dbConfig = require("../../config/db_config");
const userPictures = require("./userPictures");
const fs = require("fs");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const onlineUsers = new onlineUsersArray().getInstance();
const mySqlConnection = dbConfig;
const {infoLogger, errLogger} = require("../../utils/logger");
const {brotliCompress} = require("zlib");

const formatYmd = (date) => date.toISOString().slice(0, 10);

const queryUserConfiguration = (arr, curr_userid, cb) => {
	let mergeObjects = [];

	mySqlConnection.query(
		`SELECT longitude, latitude from user_location where user_id=${curr_userid}`,
		(err, rows) => {
			if (err || rows === undefined) {
				return cb(undefined);
			}

			if (rows.length === 0) {
				longitude_var = "Longitude";
				latitude_var = "Latitude";
			} else {
				longitude_var = rows[0].longitude;
				latitude_var = rows[0].latitude;
			}

			mySqlConnection.query(
				`SELECT distinct a.*, TIMESTAMPDIFF(YEAR, a.date_of_birth, CURDATE()) AS age, b.image,f.search_mode,s.user_status,
      ( 3959 * acos ( cos ( radians(${latitude_var})) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - 
          radians(${longitude_var}) ) + sin ( radians(${latitude_var})) * sin( radians( Latitude ) ) ) )*1000 AS
          distance
      FROM user_configuration a 
      LEFT JOIN user_location c
      ON a.user_id =  c.user_id 
      LEFT JOIN User_pictures b 
      ON a.user_id =  b.user_id 
      left JOIN Filters f
              ON a.user_id = f.user_id
      left join user_status s
      ON a.user_id = s.user_id
      WHERE a.user_id IN (${arr}) and (b.main_image = '1' or b.main_image is null)
      ORDER BY first_name asc, last_name asc`,
				(err, rows) => {
					if (err || rows === undefined) {
						return cb(undefined);
					}

					if (rows.length > 0) {
						for (let i = 0; i < rows.length; i++) {
							if (rows[i].image !== null) {
								rows[i].image = userPictures.getPicNameAndEncode(rows[i].image);
							} else {
								if (rows[i].gender === "Man") {
									rows[i].image =
										userPictures.getPicNameAndEncode("male_profile.jpg");
								} else if (rows[i].gender === "Woman") {
									rows[i].image =
										userPictures.getPicNameAndEncode("woman_profile.jpg");
								} else {
									rows[i].image = userPictures.getPicNameAndEncode(
										"non_binary_profile.PNG"
									);
								}
							}

							if (rows[i].search_mode === null) {
								rows[i].search_mode = "Whatever";
							}

							if (onlineUsers.includesAUser(parseInt(rows[i].user_id), 10)) {
								// This user is Online
								mergeObjects.push(Object.assign({}, rows[i], {online: 1}));
							} else {
								// This user is Offline
								mergeObjects.push(Object.assign({}, rows[i], {online: 0}));
							}
						}
					}

					return cb(mergeObjects);
				}
			);
		}
	);
};

getAllUsersConfiguration = (req, cb) => {
	infoLogger.info("This is an info log");
	mySqlConnection.query(
		`SELECT a.*, TIMESTAMPDIFF(YEAR, a.date_of_birth, CURDATE()) AS age FROM user_configuration a`,
		(err, rows) => {
			if (err || rows === undefined) {
				return cb(undefined);
			} else {
				return cb(rows);
			}
		}
	);
};

getUserConfigurationInner = (req, curr_userid, cb) => {
	infoLogger.info("This is an info log");

	if (req.params.userid.length === 0) {
		return cb([]);
	} else {
		const arr = req.params.userid.split(",");
		queryUserConfiguration(arr, curr_userid, (config) => {
			return cb(config);
		});
	}
};

getUserConfiguration = (req, res) => {
	infoLogger.info("This is an info log");
	const arr = req.params.userid.split(",");

	if (!req.params.curr_userid) {
		curr_userid = arr[0];
	} else {
		curr_userid = req.params.curr_userid;
	}

	queryUserConfiguration(arr, curr_userid, (config) => {
		try {
			if (config === undefined) {
				throw new Error(
					"User Configuration (Outer) - Query User Configuration CB failed"
				);
			} else {
				res.send(config);
			}
		} catch (err) {
			errLogger.error({err});
			res.status(500).send("Internal Error");
		}
	});
};

getUsersConfigurationByRadius = (req, cb) => {
	infoLogger.info("This is an info log");
	const user_id = req.user_id;
	const radius = req.radius_filter;

	mySqlConnection.query(
		`SELECT longitude, latitude FROM user_location WHERE user_id=${user_id}`,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error(err);
				}

				if (rows.length === 0) {
					longitude_var = "Longitude";
					latitude_var = "Latitude";
				} else {
					longitude_var = rows[0].longitude;
					latitude_var = rows[0].latitude;
				}

				mySqlConnection.query(
					`SELECT distinct b.*, a.longitude, a.latitude, ( 3959 * acos ( cos ( radians(${latitude_var})) * cos( radians( Latitude ) ) * cos( radians( Longitude ) - 
					radians(${longitude_var}) ) + sin ( radians(${latitude_var})) * sin( radians( Latitude ) ) ) )*1000 AS distance 
					FROM user_configuration b 
					left join user_location a
					on a.user_id = b.user_id
					HAVING ((distance < ${radius}) and (user_id != ${user_id})) ORDER BY distance`,
					(err, rows) => {
						try {
							if (err || rows === undefined) {
								throw new Error(err);
							}
							return cb(rows);
						} catch (err) {
							return cb(undefined);
						}
					}
				);
			} catch (err) {
				return cb(undefined);
			}
		}
	);
};

createUserConfiguration = (req, res) => {
	infoLogger.info("This is an info log");
	const email = req.body.email;

	mySqlConnection.query(
		`select user_id from Users where email = "${email}"`,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error(
						"User Configuration - SELECT user by the email failed, MySQL Error. Check DB"
					);
				} else {
					user_id = rows[0].user_id;
					let first_name = req.body.first_name;
					let last_name = req.body.last_name;

					//date of birth handle
					let year = req.body.date_of_birth.substring(6, 10);
					let month = req.body.date_of_birth.substring(3, 5);
					let day = req.body.date_of_birth.substring(0, 2);
					let dateOfBirthStr = year + "-" + month + "-" + day;
					let dateOfBirth = formatYmd(new Date(dateOfBirthStr));

					let city = req.body.city;
					let gender = req.body.gender;
					let phoneNumber = req.body.phone_number;
					let registerDate = formatYmd(new Date());
					let relationship_status = req.body.relationship_status;
					let sexual_orientation = req.body.sexual_orientation;
					let profession = req.body.profession;
					let pronoun = req.body.pronoun;
					let hobbies = req.body.hobbies;

					mySqlConnection.query(
						`INSERT INTO user_configuration (user_id, first_name, last_name, date_of_birth, city, gender, phone_number, registration_date, relationship_status, sexual_orientation, profession, pronoun, hobbies) VALUES ("${user_id}","${first_name}","${last_name}","${dateOfBirth}","${city}","${gender}","${phoneNumber}","${registerDate}","${relationship_status}","${sexual_orientation}","${profession}","${pronoun}", "${hobbies}")`,
						(err, rows) => {
							try {
								if (err || rows === undefined || rows.affectedRows < 1) {
									mySqlConnection.query(
										`delete from Users where email = "${email}"`,
										(err, rows) => {
											try {
												if (err || rows === undefined) {
													throw new Error(
														"User Configuration - failed DELETE from Users because user configuration insert failed, MySQL Error - Check DB!"
													);
												} else {
													throw new Error(
														`User Configuration - Insert user configuration failed, User not added (DB is OK)`
													);
												}
											} catch (err) {
												errLogger.error({err});
												res.status(500).send("Internal Error");
											}
										}
									);
								} else {
									res.send({
										user_id: user_id,
										msg: "user Configuration (and user row) of user added successfully",
									});
								}
							} catch (err) {
								errLogger.error({err});
								res.status(500).send("Internal Error");
							}
						}
					);
				}
			} catch (err) {
				errLogger.error({err});
				return res.status(500).send("Internal Error");
			}
		}
	);
};

deleteUserConfiguration = (req, res) => {
	infoLogger.info("This is an info log");
	mySqlConnection.query(
		`delete from user_configuration where user_id = ${req.params.userid}`,
		// "DELETE FROM user_configuration WHERE user_id=?",
		// req.params.userid,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error("User Configuration - DELETE request, MySQL Error");
				} else {
					res.send("user configuration deleted successfully");
				}
			} catch (err) {
				errLogger.error({err});
				res.status(500).send("Internal Error");
			}
		}
	);
};

updateUserConfiguration = (req, res) => {
	infoLogger.info("This is an info log");
	let user_id = req.params.userid;
	let first_name = req.body.first_name;
	let last_name = req.body.last_name;
	let year = req.body.date_of_birth.substring(6, 10);
	let month = req.body.date_of_birth.substring(3, 5);
	let day = req.body.date_of_birth.substring(0, 2);
	let dateOfBirthStr = year + "-" + month + "-" + day;
	let dateOfBirth = formatYmd(new Date(dateOfBirthStr));
	let city = req.body.city;
	let gender = req.body.gender;
	let phoneNumber = req.body.phone_number;
	let relationship_status = req.body.relationship_status;
	let sexual_orientation = req.body.sexual_orientation;
	let profession = req.body.profession;
	let pronoun = req.body.pronoun;
	let hobbies = req.body.hobbies;

	mySqlConnection.query(
		`UPDATE user_configuration SET first_name='${first_name}', last_name='${last_name}', date_of_birth='${dateOfBirth}', city='${city}', gender='${gender}', phone_number='${phoneNumber}', relationship_status='${relationship_status}', sexual_orientation='${sexual_orientation}', profession='${profession}', pronoun='${pronoun}', hobbies='${hobbies}' WHERE user_id=${user_id}`,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error("User Configuration - UPDATE user configuration");
				} else {
					res.send("user configuration updated successfully");
				}
			} catch (err) {
				errLogger.error({err});
				res.status(500).send("Internal Error");
			}
		}
	);
};

module.exports = {
	getAllUsersConfiguration,
	getUserConfigurationInner,
	getUserConfiguration,
	getUsersConfigurationByRadius,
	createUserConfiguration,
	deleteUserConfiguration,
	updateUserConfiguration,
};
