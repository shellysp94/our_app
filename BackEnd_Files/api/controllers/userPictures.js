const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const {infoLogger, errLogger} = require("../../utils/logger");

const path = require("path");
const fs = require("fs");
const {resolve} = require("path");
const {rejects} = require("assert");

function getPicNameAndEncode(imageName) {
	dirnametemp = __dirname.substring(0, __dirname.length - 15);
	//local host
	finalFilePath = dirnametemp + "images\\" + imageName;
	//ec2
	//finalFilePath = dirnametemp + "images//" + imageName;

	//encode image as base 64
	try {
		var imageAsBase64 = fs.readFileSync(finalFilePath, "base64");
		return imageAsBase64;
	} catch (err) {
		return null;
	}
}

function deletePicture(user_id, imageName, res) {
	mySqlConnection.query(
		`DELETE FROM User_pictures WHERE user_id = ${user_id} AND image = "${imageName}"`,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error(
						"User Pictures - DELETE user's picture by image name, MySQL Error"
					);
				}

				dirnametemp = __dirname.substring(0, __dirname.length - 15);
				finalFilePath = dirnametemp + "images\\" + imageName; //for localhost
				// finalFilePath = dirnametemp + "images/" + imageName; //for aws
				fs.unlinkSync(finalFilePath);
				res.send("picture deleted successfully");
				// fs.unlink(finalFilePath, function (err) {
				//   if (err) {
				// 		throw new Error(
				// 			"User Pictures - DELETE user's picture by image name, FS.unlink Error"
				// 		);
				// 		//console.log(err);
				// 	} else {
				// 		res.send("picture deleted successfully");
				// 	}
				// });
			} catch (err) {
				errLogger.error({err});
				return res.status(500).send("Internal Error");
			}
		}
	);
}

function setRandomImageToBeMain(user_id, imageNameToUpdate) {
	return new Promise((resolve, reject) => {
		mySqlConnection.query(
			`UPDATE User_pictures SET main_image = '1' WHERE user_id=${user_id} AND image = "${imageNameToUpdate}" `,
			(err, rows) => {
				if (err || rows === undefined || rows.affectedRows < 1) {
					reject(err);
				}
				resolve("success");
			}
		);
	});
}

getUserPictures = (req, res) => {
	infoLogger.info("This is an info log");

	mySqlConnection.query(
		`SELECT * from User_pictures WHERE user_id = ${req.params.userid}`,
		(err, rows) => {
			try {
				if (err || rows === undefined) {
					throw new Error("User Picture - GET User's Pictures, MySQL Error");
				}

				if (rows.length > 0) {
					for (var i = 0; i < rows.length; i++) {
						const pictureNameAndEncode = getPicNameAndEncode(rows[i].image);
						if (pictureNameAndEncode === null) {
							throw new Error(
								"User Picture - GET Picture Name And Encode (FS) failed"
							);
						}

						rows[i].image = getPicNameAndEncode(rows[i].image);
					}
					return res.send(rows);
				} else {
					mySqlConnection.query(
						`SELECT * from user_configuration where user_id = ${req.params.userid}`,
						(err, rows) => {
							try {
								if (err || rows === undefined) {
									throw new Error(
										"User Pictures - GET user's pictures - query to determine user's gender"
									);
								}

								main_image = "1";
								user_id = req.params.userid;

								if (rows[0].gender == "Woman") {
									user_image = getPicNameAndEncode("woman_profile.jpg");
								} else if (rows[0].gender == "Man") {
									user_image = getPicNameAndEncode("male_profile.jpg");
								} else {
									user_image = getPicNameAndEncode("non_binary_profile.PNG");
								}

								return res.send([
									{
										user_id: user_id,
										image: user_image,
										main_image: main_image,
									},
								]);
							} catch (err) {
								errLogger.error({err});
								return res.status(500).send("Internal Error");
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

getUserMainPicture = (req, res) => {
	infoLogger.info("This is an info log");
	mySqlConnection.query(
		"SELECT* from User_pictures WHERE user_id=? AND main_image='1'",
		[req.params.userid],
		(err, rows) => {
			try {
				res.send(rows);
			} catch {
				console.log(err);
			}
		}
	);
};

deleteUserPicture = (req, res) => {
	infoLogger.info("This is an info log");
	const imageName = req.body.image;
	const user_id = req.params.userid;
	mySqlConnection.query(
		`SELECT* from User_pictures WHERE user_id = ${user_id} order by main_image desc`,
		async (err, rows) => {
			try {
				if (rows.length === 1 && rows[0].image === imageName) {
					deletePicture(user_id, imageName, res);
				} else if (rows.length > 1) {
					if (rows[0].image === imageName) {
						await setRandomImageToBeMain(user_id, rows[1].image);
						deletePicture(user_id, imageName, res);
					} else {
						deletePicture(user_id, imageName, res);
					}
				}
			} catch (err) {
				errLogger.error(err);
			}
		}
	);
};

updateUserPicture = (req, res) => {
	infoLogger.info("This is an info log");
	user_id = req.params.userid;
	old_image = req.body.old_image;
	image = req.file.path.substring(7);
	main_image = req.body.main_image;

	mySqlConnection.query(
		"UPDATE User_pictures SET image=?, main_image=? WHERE user_id=? and image=?",
		[image, main_image, user_id, old_image],
		(err, result) => {
			if (!err) {
				dirnametemp = __dirname.substring(0, __dirname.length - 15);
				finalFilePath = dirnametemp + "images\\" + old_image;
				fs.unlink(finalFilePath, function (err) {
					if (err) {
						console.log(err);
					} else {
						res.send("picture updated successfully");
					}
				});
			} else {
				console.log(err);
			}
		}
	);
};

uploadBase64Image = async (req, res, next) => {
	try {
		infoLogger.info("This is an info log");
		let user_id = req.params.userid;
		main_image = req.body.main_image;
		mySqlConnection.query(
			`SELECT* FROM User_pictures WHERE user_id=? AND main_image='1'`,
			[user_id],
			(err, rows) => {
				if (!err) {
					if (rows.length > 0 && main_image == "1") {
						return res.send({msg: "user already has main image"});
					} else {
						const pathName = "./images/" + Date.now() + ".png";
						const imgdata = req.body.base64image;
						const base64Data = imgdata.replace(
							/^data:([A-Za-z-+/]+);base64,/,
							""
						);
						fs.writeFileSync(pathName, base64Data, {encoding: "base64"});
						mySqlConnection.query(
							`INSERT INTO User_pictures (user_id, image, main_image) VALUES ("${user_id}","${pathName.substring(
								9
							)}","${main_image}")`,
							(err, result) => {
								if (!err) {
									return res.send({
										msg: "picture of user added successfully",
										image: pathName.substring(9),
									});
								} else {
									console.log(err);
								}
							}
						);
					}
				}
			}
		);
	} catch (e) {
		next(e);
	}
};

module.exports = {
	getPicNameAndEncode,
	getUserPictures,
	getUserMainPicture,
	deleteUserPicture,
	updateUserPicture,
	uploadBase64Image,
};
