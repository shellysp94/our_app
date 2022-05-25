const dbConfig = require("../../config/db_config");
const userPictures = require("../controllers/userPictures");
const fs = require("fs");
const mySqlConnection = dbConfig;

const formatYmd = (date) => date.toISOString().slice(0, 10);


const queryUserConfiguration = (arr, callback) => {

	mySqlConnection.query(
		`SELECT a.*, TIMESTAMPDIFF(YEAR, a.date_of_birth, CURDATE()) AS age, b.image 
		FROM user_configuration a 
		LEFT JOIN user_pictures b 
		ON a.user_id =  b.user_id 
		WHERE a.user_id IN (?) and (b.main_image = '1' or b.main_image is null)
		ORDER BY first_name asc, last_name asc `,
		[arr],
		(err, rows) => {
			if (!err) {
				if (rows.length > 0) {
					for (let i = 0; i < rows.length; i++) {
						if (rows[i].image !== null) {
							rows[i].image =userPictures.getPicNameAndEncode(rows[i].image);
						}
						else
						{
							if(rows[i].gender == 'Man')
							{
								rows[i].image =  userPictures.getPicNameAndEncode("male_profile.jpg")
							}
							else if(rows[i].gender == 'Woman')
							{
								rows[i].image = userPictures.getPicNameAndEncode("woman_profile.jpg")
							}

							else
							{
								rows[i].image = userPictures.getPicNameAndEncode("non_binary_profile.PNG")
							}
						}
					}
				}

				return callback(rows);
			} else {
				console.log(err);
			}
		}
	);
}

module.exports = {
	getAllUsersConfiguration: (req, cb) => {
		mySqlConnection.query(
			`SELECT a.*, TIMESTAMPDIFF(YEAR, a.date_of_birth, CURDATE()) AS age FROM user_configuration a`,
			(err, rows) => {
				if (!err) {
					return cb(rows);
				} else {
					console.log(err);
				}
			}
		);
	},

	getUserConfigurationInner: (req, cb) => {
		const arr = req.params.userid.split(",");
		return queryUserConfiguration(arr, cb);
	},

	getUserConfiguration: (req, res) => {
		const arr = req.params.userid.split(",");

		return queryUserConfiguration(arr, (config) => { res.send(config) });
	},

	createUserConfiguration: (req, res) => {
		/////////////
		mySqlConnection.query(
			`SELECT user_id from users where email=?`,
			[req.body.email],
			(err, rows) => {
				if (err) {
					console.log(err);
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
					let radius = req.body.radius;
					let longitude = req.body.longitude;
					let latitude = req.body.latitude;

					mySqlConnection.query(
						`INSERT INTO user_configuration (user_id, first_name, last_name, date_of_birth, city, gender, phone_number, registration_date, relationship_status, sexual_orientation, profession, pronoun, hobbies, radius, longitude, latitude) VALUES ("${user_id}","${first_name}","${last_name}","${dateOfBirth}","${city}","${gender}","${phoneNumber}","${registerDate}","${relationship_status}","${sexual_orientation}","${profession}","${pronoun}", "${hobbies}" ,"${radius}","${longitude}","${latitude}")`,
						(err, result) => {
							if (!err) {
								res.send("user configuration of user added successfully");
							} else {
								console.log(err);
							}
						}
					);
				}
			}
		);
	},
	deleteUserConfiguration: (req, res) => {
		mySqlConnection.query(
			"DELETE FROM user_configuration WHERE user_id=?",
			req.params.userid,
			(err, resuls) => {
				if (!err) {
					res.send("user configuration deleted successfully");
				} else {
					console.log(err);
				}
			}
		);
	},
	updateUserConfiguration: (req, res) => {
		let user_id = req.params.userid;
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		let dateOfBirth = formatYmd(new Date(req.body.dateOfBirth));
		let city = req.body.city;
		let gender = req.body.gender;
		let phoneNumber = req.body.phoneNumber;
		let registerDate = formatYmd(new Date());
		let relationship_status = req.body.relationship_status;
		let sexual_orientation = req.body.sexual_orientation;
		let profession = req.body.profession;
		let pronoun = req.body.pronoun;
		let hobbies = req.body.hobbies;
		let radius = req.body.radius;
		let longitude = req.body.longitude;
		let latitude = req.body.latitude;

		mySqlConnection.query(
			"UPDATE user_configuration SET first_name=?, last_name=?, password=?, dateOfBirth=?, city=?, gender=?, phone_number=?, registration_date=?, relationship_status=?, sexual_orientation=?, profession=?, pronoun=?, hobbies=? ,radius=?, longitude=?, latitude=? WHERE user_id=?",
			[
				first_name,
				last_name,
				dateOfBirth,
				city,
				gender,
				phoneNumber,
				registerDate,
				relationship_status,
				sexual_orientation,
				profession,
				pronoun,
				hobbies,
				radius,
				longitude,
				latitude,
				req.params.user_id,
			],
			(err, result) => {
				if (!err) {
					res.send("user configuration updated successfully");
				} else {
					console.log(err);
				}
			}
		);
	},
	updateSearchMode: (req, res) => {
		let searchMode = req.body.search_mode;
		mySqlConnection.query(
			"SELECT * from user_configuration where user_id=?",
			req.params.userid,
			(err, rows) => {
				if (!err) {
					if (rows.length > 0) {
						mySqlConnection.query(
							"UPDATE user_configuration SET search_mode=? WHERE user_id=?",
							[searchMode, req.params.userid],
							(err, results) => {
								if (!err) {
									res.send("Search mode updated");
								} else {
									console.log(err);
								}
							}
						);
					}
				}
			}
		);
	},
};
