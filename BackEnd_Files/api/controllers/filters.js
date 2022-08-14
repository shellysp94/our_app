const dbConfig = require("../../config/db_config");
const {
	getAllUsersConfiguration,
	getUserConfigurationInner,
	getUsersConfigurationByRadius,
} = require("./userConfiguration");
const {getAllUserConnectionsType} = require("./friendRequest");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const onlineUsers = new onlineUsersArray().getInstance();
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
	getAllUsersConfiguration(req, (allUsers) => {
		allUsers.forEach((user) => {
			if (parseInt(user.user_id, 10) !== parseInt(req.user_id, 10)) {
				allUsersWithoutMe.push(user);
			}
		});
		return callback(allUsersWithoutMe);
	});
}

function interestedInFilteringHelper(
	currentUserGender,
	currentUserSexualOrientation,
	callback
) {
	let sqlQuery;

	switch (currentUserSexualOrientation) {
		case "Heterosexual":
			sqlQuery = `(sexual_orientation like 'Heterosexual' and gender not like '${currentUserGender}')`;
			break;
		case "Homosexual":
			sqlQuery = `(sexual_orientation like 'Homosexual' and gender like '${currentUserGender}')`;
			break;
		case "Bisexual":
			sqlQuery = `(sexual_orientation like 'Bisexual')`;
			break;
		case "Asexual":
			sqlQuery = `(sexual_orientation like 'Asexual')`;
			break;
		default:
			sqlQuery = "hello - switch case --> default";
	}

	return callback(sqlQuery);
}

function createSqlQueryForInterestedInFiltering(
	interestedInFilter,
	currentUserGender,
	currentUserSexualOrientation,
	callback
) {
	let filters = interestedInFilter.split(",");
	let friendshipFilters = filters.filter(
		(filter) =>
			filter === "Friends" ||
			filter === "Sport buddy" ||
			filter === "Study buddy" ||
			filter === "Work buddy"
	);
	let relationshipFilters = filters.filter(
		(filter) =>
			filter === "Hookup" ||
			filter === "Long term relationship" ||
			filter === "Short term relationship"
	);
	let sqlQuery;
	if (friendshipFilters.length > 0 && relationshipFilters.length > 0) {
		// Both - friendship AND relationship filters
		interestedInFilteringHelper(
			currentUserGender,
			currentUserSexualOrientation,
			(toConcatSqlQuery) => {
				//sqlQuery = sqlQuery.concat(" and (");
				sqlQuery = " and (";
				sqlQuery = sqlQuery.concat(toConcatSqlQuery);
				sqlQuery = sqlQuery.concat(
					splitCommas(
						" and (interested_in_filter like ",
						"interested_in_filter",
						relationshipFilters.toString()
					)
				);
				sqlQuery = sqlQuery.concat(")");
				sqlQuery = sqlQuery.concat(
					splitCommas(
						" or (interested_in_filter like ",
						"interested_in_filter",
						friendshipFilters.toString()
					)
				);
				sqlQuery = sqlQuery.concat("))");
			}
		);
	} else if (friendshipFilters.length > 0 && relationshipFilters.length === 0) {
		// Only friendship filters
		sqlQuery = splitCommas(
			" and (interested_in_filter like ",
			"interested_in_filter",
			interestedInFilter
		);
		sqlQuery = sqlQuery.concat(")");
	} else if (friendshipFilters.length === 0 && relationshipFilters.length > 0) {
		// Only relationship filters
		interestedInFilteringHelper(
			currentUserGender,
			currentUserSexualOrientation,
			(toConcatSqlQuery) => {
				sqlQuery = " and ";
				sqlQuery = sqlQuery.concat(toConcatSqlQuery);
				sqlQuery = sqlQuery.concat(
					splitCommas(
						" and (interested_in_filter like ",
						"interested_in_filter",
						interestedInFilter
					)
				);
				sqlQuery = sqlQuery.concat(")");
			}
		);
	}
	return callback(sqlQuery);
}

function createFriendsOfFriendsQuery(myFriendsUserid, sqlQuery, callback) {
	arrayLength = myFriendsUserid.length;

	for (user = 0; user < arrayLength; user++) {
		if (user === 0) {
			sqlQuery = sqlQuery.concat(
				`user_a_id = ${myFriendsUserid[user]} or user_b_id = ${myFriendsUserid[user]}`
			);
		} else {
			sqlQuery = sqlQuery.concat(
				` or user_a_id = ${myFriendsUserid[user]} or user_b_id = ${myFriendsUserid[user]}`
			);
		}
	}
	sqlQuery = sqlQuery.concat(")");

	return callback(sqlQuery);
}

function getUserFilteredUsers_OnlyOnline_Helper(
	onlyOnline,
	withFilters,
	userid,
	type,
	usersToPresent,
	res
) {
	console.log("users to present:", usersToPresent);
	let createdUsersToPresent = [];

	if (parseInt(onlyOnline, 10) === 1) {
		if (parseInt(withFilters, 10) === 1) {
			// Return users according to filters but only online users //
			usersToPresent.forEach((user) => {
				if (onlineUsers.includesAUser(user)) {
					createdUsersToPresent.push(user);
				}
			});
			console.log(
				"CREATED USERS TO PRESENTS --> only online with filters:",
				createdUsersToPresent
			);
		} else {
			// Return all online users //
			onlineUsers.getOnlineUsersArray().forEach((onlineUser) => {
				if (parseInt(onlineUser.user_id, 10) !== parseInt(userid)) {
					createdUsersToPresent.push(parseInt(onlineUser.user_id, 10));
				}
			});

			console.log(
				"CREATED USERS TO PRESENTS --> only online without any filter:",
				createdUsersToPresent
			);
		}
	} else {
		if (parseInt(withFilters, 10) === 1) {
			// Return users according to filters - online and offline //
			usersToPresent.forEach((user) => {
				createdUsersToPresent.push(user);
			});
			console.log(
				"CREATED USERS TO PRESENTS --> online and offline according to filters:",
				createdUsersToPresent
			);
		} else {
			// Return users without any filters - online and offline //
			createdUsersToPresent = [0];
			console.log(
				"CREATED USERS TO PRESENTS --> online and offline without any filter:",
				createdUsersToPresent
			);
		}
	}

	let resultArrayToObject = {
		params: {
			userid: userid,
			type: type,
			usersToPresent: createdUsersToPresent,
		},
	};

	getAllUserConnectionsType(resultArrayToObject, res);
}

function createSearchModeQuery(searchMode) {
	return new Promise((resolve, reject) => {
		if (searchMode === undefined || searchMode.length <= 0) {
			reject(`!!SEARCH MODE!!\nSomething wrong. Search mode parameter illegal`);
		}
		if (searchMode !== "Whatever") {
			resolve(`and (search_mode like '${searchMode}')`);
		} else {
			resolve("");
		}
	});
}

function createHobbiesQuery(hobbies) {
	return new Promise((resolve, reject) => {
		if (hobbies === undefined || hobbies.length <= 0) {
			reject(`!!HOBBIES!!\nSomething wrong. Hobbies parameter illegal`);
		}
		if (hobbies !== "Hobbies") {
			let sqlQuery = splitCommas(" and (hobbies like ", "hobbies", hobbies);
			sqlQuery = sqlQuery.concat(")");
			resolve(sqlQuery);
		} else {
			resolve("");
		}
	});
}

function createGenderQuery(gender) {
	return new Promise((resolve, reject) => {
		if (gender === undefined || gender.length <= 0) {
			reject(`!!GENDER!!\nSomething wrong. Gender parameter illegal`);
		}
		if (gender === "Men") {
			resolve(` and (UC.gender like 'Man' and UC.gender not like 'Woman')`);
		} else if (gender === "Women") {
			resolve(` and (UC.gender like 'Woman')`);
		} else {
			resolve(
				` and (UC.gender like 'Woman' or UC.gender like 'Man' or UC.gender like 'prefer not to say')`
			);
		}
	});
}

function createRelationshipQuery(relationship) {
	return new Promise((resolve, reject) => {
		if (relationship === undefined || relationship.length <= 0) {
			reject(
				`!!RELATIONSHIP!!\nSomething wrong. Relationship parameter illegal`
			);
		}
		if (relationship !== "Relationship") {
			let sqlQuery = splitCommas(
				" and (relationship_filter like ",
				"relationship_filter",
				relationship
			);
			sqlQuery = sqlQuery.concat(
				splitCommas(
					" or relationship_status like ",
					"relationship_status",
					relationship
				)
			);

			sqlQuery = sqlQuery.concat(")");
			resolve(sqlQuery);
		} else {
			resolve("");
		}
	});
}

function createInterestedInQuery(req) {
	let interestedIn = req.interested_in_filter;
	let currentUserId = req.user_id;

	return new Promise((resolve, reject) => {
		if (interestedIn === undefined || interestedIn.length <= 0) {
			reject(
				`!!INTERESTED IN!!\nSomething went wrong. Interested In parameter illegal`
			);
		}
		if (interestedIn !== "Interested in") {
			mySqlConnection.query(
				`select gender, sexual_orientation from user_configuration where user_id = ${currentUserId}`,
				(err, rows) => {
					try {
						let currentUserGender = rows[0].gender;
						let currentUserSexualOrientation = rows[0].sexual_orientation;
						createSqlQueryForInterestedInFiltering(
							interestedIn,
							currentUserGender,
							currentUserSexualOrientation,
							(sqlQuery) => {
								if (sqlQuery.length <= 0) {
									reject(
										`!!INTERESTED IN!!\nSomething went wrong. Interested In parameter illegal`
									);
								} else {
									resolve(sqlQuery);
								}
							}
						);
					} catch (err) {
						console.log(err);
						reject(
							`The third reject --> !!INTERESTED IN!!\nSomething went wrong. Interested In parameter illegal`
						);
					}
				}
			);
		} else {
			resolve("");
		}
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

getFriendsOfFriends = (req, res) => {
	const userid = req.params.userid;
	let myFriends_myFriendsOfFriends = {};
	let myFriendsUserid = [];
	let myFriendsOfFriendsUserid = [];
	let sqlQuery = `select * from connections where connected = 1 and (user_a_id != ${userid} and user_b_id != ${userid}) and (`;

	mySqlConnection.query(
		`select user_a_id, user_b_id from connections where (user_a_id = ${userid} or user_b_id = ${userid}) and connected = 1`,
		(err, rows) => {
			try {
				if (typeof rows !== "undefined" && rows.length > 0) {
					for (row = 0; row < rows.length; row++) {
						if (parseInt(rows[row].user_a_id, 10) !== parseInt(userid, 10)) {
							myFriendsUserid.push(parseInt(rows[row].user_a_id, 10));
						} else {
							myFriendsUserid.push(parseInt(rows[row].user_b_id, 10));
						}
					}
					createFriendsOfFriendsQuery(myFriendsUserid, sqlQuery, (response) => {
						// console.log(
						// 	"the response from friends of friends create query functions:\n" +
						// 		response
						// );
						mySqlConnection.query(response, (err, rows) => {
							try {
								if (typeof rows !== "undefined" && rows.length > 0) {
									for (
										myFriendOfFriend = 0;
										myFriendOfFriend < rows.length;
										myFriendOfFriend++
									) {
										if (
											!myFriendsUserid.includes(
												parseInt(rows[myFriendOfFriend].user_A_id, 10)
											)
										) {
											myFriendsOfFriendsUserid.push(
												parseInt(rows[myFriendOfFriend].user_A_id, 10)
											);
										}
										if (
											!myFriendsUserid.includes(
												parseInt(rows[myFriendOfFriend].user_B_id, 10)
											)
										) {
											myFriendsOfFriendsUserid.push(
												parseInt(rows[myFriendOfFriend].user_B_id, 10)
											);
										}
									}
								}
								console.log("my friends user id:\n" + myFriendsUserid);
								console.log(
									"my friends of friends user id:\n" + myFriendsOfFriendsUserid
								);

								let myFriendsRequest = {
									params: {
										userid: String(myFriendsUserid),
									},
								};
								let myFriendsOfFriendsRequest = {
									params: {
										userid: String(myFriendsOfFriendsUserid),
									},
								};
								getUserConfigurationInner(
									myFriendsRequest,
									(myFriendsConfigurations) => {
										Object.assign(myFriends_myFriendsOfFriends, {
											myFriends: myFriendsConfigurations,
										});

										getUserConfigurationInner(
											myFriendsOfFriendsRequest,
											(myFriendsOfFriendsConfigurations) => {
												Object.assign(myFriends_myFriendsOfFriends, {
													myFriendsOfFriends: myFriendsOfFriendsConfigurations,
												});
												res.send(myFriends_myFriendsOfFriends);
											}
										);
									}
								);
							} catch (err) {
								console.log(err.message);
							}
						});
					});
				} else {
					msgToClient = {
						msg: `user ${userid} does not have friends yet`,
					};
					return res.send(msgToClient);
				}
			} catch (err) {
				console.log(err.message);
			}
		}
	);
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
	let onlyOnline = req.params.onlyOnline;
	let usersToPresent = [];
	let mutuals = [];
	let age = [];
	let radius = [];
	let sqlQuery = `select UC.user_id from user_configuration UC left join filters F using(user_id) where (UC.user_id != ${req.params.userid}) `;
	let resolve;

	getUserFilter(req, async (userFilter) => {
		if (userFilter.length === 0) {
			// user don't have filters - return to client all users in db
			getUserFilteredUsers_OnlyOnline_Helper(
				onlyOnline,
				0,
				req.params.userid,
				0,
				usersToPresent,
				res
			);
		} else {
			try {
				resolve = await createSearchModeQuery(userFilter[0].search_mode);
				sqlQuery = sqlQuery.concat(resolve);
				console.log(sqlQuery);
				resolve = await createHobbiesQuery(userFilter[0].hobbies_filter);
				sqlQuery = sqlQuery.concat(resolve);
				resolve = await createGenderQuery(userFilter[0].gender_filter);
				sqlQuery = sqlQuery.concat(resolve);
				resolve = await createRelationshipQuery(
					userFilter[0].relationship_filter
				);
				sqlQuery = sqlQuery.concat(resolve);
				resolve = await createInterestedInQuery(userFilter[0]);
				sqlQuery = sqlQuery.concat(resolve);
				console.log(
					"THE QUERY FROM GET FILTERS (UNTIL INTERESTED IN):\n" + sqlQuery
				);

				mySqlConnection.query(sqlQuery, (err, rows) => {
					try {
						if (rows !== undefined && rows.length > 0) {
							for (var user of rows) {
								mutuals.push(user.user_id);
							}
							console.log("mutuals are:", mutuals);

							getUsersWithCommonAgeFilter(userFilter[0], (response) => {
								response.forEach((user) => {
									if (mutuals.includes(user.user_id)) {
										age.push(user.user_id);
									}
								});
								console.log("after age:", age);

								getUsersConfigurationByRadius(userFilter[0], (response) => {
									response.forEach((user) => {
										if (age.includes(user.user_id)) {
											radius.push(user.user_id);
										}
									});
									console.log("after radius:", radius);

									getUserFilteredUsers_OnlyOnline_Helper(
										onlyOnline,
										1,
										req.params.userid,
										userFilter[0].friends_only_filter,
										radius,
										res
									);
								});
							});
						} else {
							msgToClient = {
								msg: "There are no suitable users to display",
							};
							return res.send(msgToClient);
						}
					} catch (err) {
						console.log(err.message);
					}
				});
			} catch (resolve) {
				console.log(resolve);
			}
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
	const radiusFilter = req.body.radius_filter;
	const friendsOnly = req.body.friends_only_filter;

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
		`INSERT INTO Filters (user_id, search_mode, hobbies_filter, gender_filter, relationship_filter, interested_in_filter, age_filter, radius_filter, friends_only_filter) 
      values (${userid}, '${searchMode}', '${hobbiesFilter}', '${genderFilter}', '${relationshipFilter}', '${interestedInFilter}', '${ageFilter}', ${radiusFilter}, ${friendsOnly}) 
      ON DUPLICATE KEY UPDATE user_id = ${userid}, search_mode = '${searchMode}', hobbies_filter = '${hobbiesFilter}', gender_filter = '${genderFilter}', 
      relationship_filter = '${relationshipFilter}', interested_in_filter = '${interestedInFilter}', age_filter = '${ageFilter}', radius_filter = ${radiusFilter}, friends_only_filter = ${friendsOnly}`,
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
	getAllFilters,
	getUserFilter,
	getFriendsOfFriends,
	getUserFriendsThatFilteredFriendsOnly,
	getUserFilteredUsers,
	createUserFilter,
	deleteUserFilter,
	//getUsersWithCommonAgeFilter
};
