const {query, response} = require("express");
const dbConfig = require("../../config/db_config");
const {
	getAllUsersConfiguration,
	getUserConfiguration,
} = require("./userConfiguration");
const {getAllUserConnectionsType} = require("./connections");
const mySqlConnection = dbConfig;

function splitCommas(myQuery, relevantColumn, string) {
	let splittedQuery = myQuery;
	let splittedString = [];
	var numberOfCommas = string.split(",").length - 1;

	for (comma = 0; comma <= numberOfCommas; comma++) {
		if (comma !== numberOfCommas) {
			splittedString[comma] =
				"'%" + string.split(",")[comma] + "%' or " + relevantColumn + " like ";
		} else {
			splittedString[comma] = "'%" + string.split(",")[comma] + "%'";
		}
		splittedQuery = splittedQuery.concat(splittedString[comma]);
	}
	return splittedQuery;
}

function noFilter(req, callback) {
	let allUsersWithoutMe = [];
	//console.log("req.user_id:", req.user_id);
	getAllUsersConfiguration(req, (allUsers) => {
		allUsers.forEach((user) => {
			if (parseInt(user.user_id, 10) !== parseInt(req.user_id, 10)) {
				//console.log(user);
				allUsersWithoutMe.push(user);
			}
		});
		//console.log("all users without me:", allUsersWithoutMe);
		return callback(allUsersWithoutMe);
	});
}

getAllFilters = (req, res) => {
	mySqlConnection.query("SELECT * FROM Filters", (err, rows) => {
		try {
			res.send(rows);
		} catch (err) {
			console.log(err.message);
		}
	});
};

getUserFilter = (req, callback) => {
	const userid = req.params.userid;

	mySqlConnection.query(
		"SELECT * FROM Filters WHERE user_id = ?",
		[userid],
		(err, rows) => {
			try {
				return callback(rows);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

getUsersWithCommonSearchMode = (req, callback) => {
	const searchMode = req.search_mode;

	if (searchMode === "Whatever") {
		//console.log(req);
		noFilter(req, (allUsersWithoutMe) => {
			//console.log(allUsersWithoutMe);
			return callback(allUsersWithoutMe);
		});
	} else {
		mySqlConnection.query(
			`select user_id from filters where search_mode like '${searchMode}'`,
			(err, rows) => {
				try {
					return callback(rows);
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	}
};

getUsersWithCommonHobbiesFilter = (req, callback) => {
	const hobbiesFilter = req.hobbies_filter;

	if (hobbiesFilter === "Hobbies") {
		noFilter(req, (allUsersWithoutMe) => {
			return callback(allUsersWithoutMe);
		});
	} else {
		let sqlQuery = splitCommas(
			"select uc.user_id from filters f right join user_configuration uc using (user_id) where hobbies like ",
			"hobbies",
			hobbiesFilter
		);

		mySqlConnection.query(sqlQuery, (err, rows) => {
			try {
				return callback(rows);
			} catch (err) {
				console.log(err.message);
			}
		});
	}
};

getUsersWithCommonGenderFilter = (req, callback) => {
	const genderFilter = req.gender_filter;

	if (genderFilter === "Gender" || genderFilter === "All") {
		noFilter(req, (allUsersWithoutMe) => {
			return callback(allUsersWithoutMe);
		});
	} else {
		let queryStr;
		if (genderFilter === "Men") {
			queryStr = `SELECT user_id FROM user_configuration WHERE gender like 'Man' and gender not like 'Woman'`;
		} else if (genderFilter === "Women") {
			queryStr = `SELECT user_id FROM user_configuration WHERE gender like 'Woman'`;
		} else {
			queryStr = `SELECT user_id FROM user_configuration WHERE gender like 'Woman' or gender like 'Man'`;
		}

		mySqlConnection.query(queryStr, (err, rows) => {
			try {
				return callback(rows);
			} catch (err) {
				console.log(err.message);
			}
		});
	}
};

getUsersWithCommonRelationshipFilter = (req, callback) => {
	const relationshipFilter = req.relationship_filter;

	if (relationshipFilter === "Relationship") {
		noFilter(req, (allUsersWithoutMe) => {
			return callback(allUsersWithoutMe);
		});
	} else {
		let sqlQuery = splitCommas(
			"select uc.user_id from filters f right join user_configuration uc using (user_id) where relationship_filter like ",
			"relationship_filter",
			relationshipFilter
		);
		sqlQuery = sqlQuery.concat(
			splitCommas(
				" or relationship_status like ",
				"relationship_status",
				relationshipFilter
			)
		);

		mySqlConnection.query(sqlQuery, (err, rows) => {
			try {
				return callback(rows);
			} catch (err) {
				console.log(err.message);
			}
		});
	}
};

getUsersWithCommonInterestedInFilter = (req, callback) => {
	const interestedInFilter = req.interested_in_filter;
	let currentUserId = req.user_id;
	let sqlQuery =
		"select uc.user_id from filters f right join user_configuration uc using (user_id) ";
	let currentUserGender, currentUserSexualOrientation;

	if (interestedInFilter === "Interested in") {
		noFilter(req, (allUsersWithoutMe) => {
			return callback(allUsersWithoutMe);
		});
	} else if (
		interestedInFilter.includes("Hookup") ||
		interestedInFilter.includes("Long term relationship") ||
		interestedInFilter.includes("Short term relationship")
	) {
		console.log("Here I need to filter wisely");
		mySqlConnection.query(
			`select gender, sexual_orientation from user_configuration where user_id = ${currentUserId}`,
			(err, rows) => {
				try {
					currentUserGender = rows[0].gender;
					currentUserSexualOrientation = rows[0].sexual_orientation;

					switch (currentUserSexualOrientation) {
						case "Heterosexual":
							console.log("heterosexual");
							sqlQuery = sqlQuery.concat(
								`where (sexual_orientation like 'Heterosexual' and gender not like ${currentUserGender})`
							);
							break;
						case "Homosexual":
							console.log("Homosexual");
							sqlQuery = sqlQuery.concat(
								`where (sexual_orientation like 'Homosexual' and gender like ${currentUserGender})`
							);
							break;
						case "Bisexual":
							console.log("im from the switch: Bisexual");
							sqlQuery = sqlQuery.concat(
								`where (sexual_orientation like 'Bisexual')`
							);
							break;
						case "Asexual":
							console.log("Asexual");
							sqlQuery = sqlQuery.concat(
								`where (sexual_orientation like 'Asexual')`
							);
							break;
						default:
							console.log("It's probably prefer not to say");
					}

					sqlQuery = sqlQuery.concat(
						splitCommas(
							" and interested_in_filter like ",
							"interested_in_filter",
							interestedInFilter
						)
					);
				} catch (err) {
					console.log(err.message);
				}
			}
		);
	} else {
		sqlQuery = splitCommas(
			"select user_id from filters where interested_in_filter like ",
			"interested_in_filter",
			interestedInFilter
		);
	}

	console.log("from the interesting in filter:", sqlQuery);
	mySqlConnection.query(sqlQuery, (err, rows) => {
		try {
			return callback(rows);
		} catch (err) {
			console.log(err.message);
		}
	});
};

getUsersWithCommonAgeFilter = (req, callback) => {
	const age = [];
	const from = JSON.parse(req.age_filter)[0];
	const until = JSON.parse(req.age_filter)[1];

	if (typeof from === "undefined" || typeof until === "undefined") {
		noFilter(req, (allUsersWithoutMe) => {
			return callback(allUsersWithoutMe);
		});
	} else {
		getAllUsersConfiguration(req, (response) => {
			response.forEach((user) => {
				if (parseInt(user.age, 10) >= from && parseInt(user.age, 10) <= until) {
					age.push(user);
				}
			});
			return callback(age);
		});
	}
};

getUserFriendsThatFilteredFriendsOnly = (req, callback) => {
	const userid = req.user_id;

	mySqlConnection.query(
		`select * from filters join connections on (filters.user_id = connections.user_A_id or filters.user_id = connections.user_B_id) 
      where user_id = ${userid} and connected = 1`,
		(err, rows) => {
			try {
				let usersFriendsOnly = [];
				for (user = 0; user < rows.length; user++) {
					if (
						!usersFriendsOnly.includes(rows[user].user_A_id) &&
						rows[user].user_A_id !== parseInt(userid, 10)
					) {
						usersFriendsOnly.push(rows[user].user_A_id);
					}
					if (
						!usersFriendsOnly.includes(rows[user].user_B_id) &&
						rows[user].user_B_id !== parseInt(userid, 10)
					) {
						usersFriendsOnly.push(rows[user].user_B_id);
					}
				}
				return callback(usersFriendsOnly);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

getUserFilteredUsers = (req, res) => {
	let searchMode = [];
	let hobbies = [];
	let gender = [];
	let relationship = [];
	let interestedIn = [];
	let age = [];
	//console.log("im userid:", req.params.userid);

	getUserFilter(req, (userFilter) => {
		if (userFilter.length === 0) {
			// user don't have filters - return to client all users in db
			let getUsersConfigurationsWithoutMyself = {
				params: {
					userid: String(req.params.userid),
					type: String(0),
					usersToPresent: [0],
				},
			};
			getAllUserConnectionsType(getUsersConfigurationsWithoutMyself, res);
		} else {
			// user have filters
			getUsersWithCommonSearchMode(userFilter[0], (response) => {
				response.forEach((user) => {
					if (parseInt(req.params.userid, 10) !== parseInt(user.user_id, 10)) {
						searchMode.push(user.user_id);
					}
				});
				//console.log("search mode:", searchMode);

				getUsersWithCommonHobbiesFilter(userFilter[0], (response) => {
					response.forEach((user) => {
						hobbies.push(user.user_id);
					});
					//console.log("hobbies:", hobbies);
					const mutualUsers_SearchMode_Hobbies = searchMode.filter((user) =>
						hobbies.includes(user)
					);

					getUsersWithCommonGenderFilter(userFilter[0], (response) => {
						response.forEach((user) => {
							gender.push(user.user_id);
						});
						//console.log("gender", gender);
						const mutualUsers_Hobbies_Gender =
							mutualUsers_SearchMode_Hobbies.filter((user) =>
								gender.includes(user)
							);

						getUsersWithCommonRelationshipFilter(userFilter[0], (response) => {
							response.forEach((user) => {
								relationship.push(user.user_id);
							});
							//console.log("relationship:", relationship);
							const mutualUsers_Gender_Relationship =
								mutualUsers_Hobbies_Gender.filter((user) =>
									relationship.includes(user)
								);

							getUsersWithCommonInterestedInFilter(
								userFilter[0],
								(response) => {
									response.forEach((user) => {
										interestedIn.push(user.user_id);
									});
									//console.log("interested in:", interestedIn);
									const mutualUsers_Relationship_InterestedIn =
										mutualUsers_Gender_Relationship.filter((user) =>
											interestedIn.includes(user)
										);

									getUsersWithCommonAgeFilter(userFilter[0], (response) => {
										//console.log(userFilter[0]);
										response.forEach((user) => {
											age.push(user.user_id);
										});
										//console.log("age", age);
										const mutualUsers_InterestedIn_Age =
											mutualUsers_Relationship_InterestedIn.filter((user) =>
												age.includes(user)
											);

										let resultArrayToObject = {
											params: {
												userid: String(req.params.userid),
												type: String(userFilter[0].friends_only_filter),
												usersToPresent: mutualUsers_InterestedIn_Age,
											},
										};

										console.log(
											"im result array:\n" + JSON.stringify(resultArrayToObject)
										);
										getAllUserConnectionsType(resultArrayToObject, res);
									});
								}
							);
						});
					});
				});
			});
		}
	});
};

createUserFilter = (req, res) => {
	const userid = req.params.userid;
	const searchMode = req.body.search_mode_filter;
	const hobbiesFilter = req.body.hobbies_filter;
	const genderFilter = req.body.gender_filter;
	const relationshipFilter = req.body.relationship_filter;
	const interestedInFilter = req.body.interested_in_filter;
	let ageFilter = req.body.age_filter;
	const friendsOnly = req.body.friends_only_filter;

	console.log("From the POST method:\n");
	console.log(
		"search mode:",
		searchMode,
		"hobbies:",
		hobbiesFilter,
		"gender:",
		genderFilter,
		"relationship:",
		relationshipFilter,
		"interesting in:",
		interestedInFilter,
		"age:",
		ageFilter,
		"friends only:",
		friendsOnly
	);

	if (ageFilter.length === 0) {
		ageFilter = "[]";
	} else {
		ageFilter = "[";
		ageFilter = ageFilter.concat(req.body.age_filter[0]);
		ageFilter = ageFilter.concat(",");
		ageFilter = ageFilter.concat(req.body.age_filter[1]);
		ageFilter = ageFilter.concat("]");
	}

	mySqlConnection.query(
		`INSERT INTO Filters (user_id, search_mode, hobbies_filter, gender_filter, relationship_filter, interested_in_filter, age_filter, friends_only_filter) 
      values (${userid}, '${searchMode}', '${hobbiesFilter}', '${genderFilter}', '${relationshipFilter}', '${interestedInFilter}', '${ageFilter}', ${friendsOnly}) 
      ON DUPLICATE KEY UPDATE user_id = ${userid}, search_mode = '${searchMode}', hobbies_filter = '${hobbiesFilter}', gender_filter = '${genderFilter}', 
      relationship_filter = '${relationshipFilter}', interested_in_filter = '${interestedInFilter}', age_filter = '${ageFilter}', friends_only_filter = ${friendsOnly}`,
		(err, rows) => {
			try {
				if (typeof rows === "undefined") {
					msgToClient = {
						msg: `Something went wrong. Filter wasn't add to database or wasn't update in the database`,
					};
					return res.send(msgToClient);
				} else {
					getUserFilteredUsers(req, res);
				}
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

updateUserHobbiesFilter = (req, res) => {
	const hobbiesFilter = req.body.hobbies_filter;
	const userid = req.params.userid;

	mySqlConnection.query(
		"UPDATE Filters SET hobbies_filter = ? WHERE user_id = ?",
		[hobbiesFilter, userid],
		(err, result) => {
			try {
				msgToClient = {
					msg: `User number ${userid} updated hobbies filter to ${hobbiesFilter} successfully`,
				};
				return res.send(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

updateUserGenderFilter = (req, res) => {
	const genderFilter = req.body.gender_filter;
	const userid = req.params.userid;

	mySqlConnection.query(
		"UPDATE Filters SET gender_filter = ? WHERE user_id = ?",
		[genderFilter, userid],
		(err, result) => {
			try {
				msgToClient = {
					msg: `User number ${userid} updated gender filter to ${genderFilter} successfully`,
				};
				return res.send(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

updateUserRelationshipFilter = (req, res) => {
	const relationshipFilter = req.body.relationship_filter;
	const userid = req.params.userid;

	mySqlConnection.query(
		"UPDATE Filters SET relationship_filter = ? WHERE user_id = ?",
		[relationshipFilter, userid],
		(err, result) => {
			try {
				msgToClient = {
					msg: `User number ${userid} updated relationship filter to ${relationshipFilter} successfully`,
				};
				return res.send(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

updateUserInterestedInFilter = (req, res) => {
	const interestedInFilter = req.body.interested_in_filter;
	const userid = req.params.userid;

	mySqlConnection.query(
		"UPDATE Filters SET interested_in_filter = ? WHERE user_id = ?",
		[interestedInFilter, userid],
		(err, result) => {
			try {
				msgToClient = {
					msg: `User number ${userid} updated interested in filter to ${interestedInFilter} successfully`,
				};
				return res.send(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

updateUserAgeFilter = (req, res) => {
	const ageFilter = req.body.age_filter;
	const userid = req.params.userid;

	mySqlConnection.query(
		"UPDATE Filters SET age_filter = ? WHERE user_id = ?",
		[ageFilter, userid],
		(err, result) => {
			try {
				msgToClient = {
					msg: `User number ${userid} updated age filter to ${ageFilter} successfully`,
				};
				return res.send(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

updateUserFriendsOnlyFilter = (req, res) => {
	const userid = req.params.userid;
	const friendsOnly = req.params.friendsOnly;

	mySqlConnection.query(
		"UPDATE Filters SET friends_only_filter = ? WHERE user_id = ?",
		[friendsOnly, userid],
		(err, result) => {
			try {
				msgToClient = {
					msg: `User number ${userid} updated friends only filter to ${friendsOnly} successfully`,
				};
				return res.send(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

deleteUserFilter = (req, res) => {
	const userid = req.params.userid;

	mySqlConnection.query(
		"delete from Filters where user_id = ?",
		[userid],
		(err, result) => {
			try {
				msgToClient = {
					msg: `User number ${userid} filter deleted successfully`,
				};
				return res.send(msgToClient);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

module.exports = {
	getAllFilters: getAllFilters,
	getUserFilter: getUserFilter,
	getUsersWithCommonSearchMode: getUsersWithCommonSearchMode,
	getUsersWithCommonHobbiesFilter: getUsersWithCommonHobbiesFilter,
	getUsersWithCommonGenderFilter: getUsersWithCommonGenderFilter,
	getUsersWithCommonRelationshipFilter: getUsersWithCommonRelationshipFilter,
	getUsersWithCommonInterestedInFilter: getUsersWithCommonInterestedInFilter,
	getUsersWithCommonAgeFilter: getUsersWithCommonAgeFilter,
	getUserFriendsThatFilteredFriendsOnly: getUserFriendsThatFilteredFriendsOnly,
	getUserFilteredUsers: getUserFilteredUsers,
	createUserFilter: createUserFilter,
	updateUserHobbiesFilter: updateUserHobbiesFilter,
	updateUserGenderFilter: updateUserGenderFilter,
	updateUserRelationshipFilter: updateUserRelationshipFilter,
	updateUserInterestedInFilter: updateUserInterestedInFilter,
	updateUserAgeFilter: updateUserAgeFilter,
	updateUserFriendsOnlyFilter: updateUserFriendsOnlyFilter,
	deleteUserFilter: deleteUserFilter,
};
