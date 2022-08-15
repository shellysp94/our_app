const {response} = require("express");
const {getUserConfigurationInner} = require("./userConfiguration");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const onlineUsers = new onlineUsersArray().getInstance();

const getAllConstants = (req, res) => {
	constants = {
		registration_form: {
			gender: ["Woman", "Man", "prefer not to say"],
			relationship_status: [
				"Relationship",
				"Single",
				"Divorced",
				"Engaged",
				"In a relationship",
				"In an open relationship",
				"Married",
				"Widowed",
			],
			sexual_orientation: [
				"Heterosexual",
				"Bisexual",
				"Homosexual",
				"Pansexual",
				"Asexual",
				"prefer not define",
			],

			pronoun: ["she/her", "he/him", "they/them", "prefer not to say"],
		},

		Hobbies: [
			{
				type: "Default",
				value: "Hobbies",
			},
			{
				type: "Sport",
				lst: [
					"basketball",
					"beach volleyball",
					"crossfit",
					"dancing",
					"football/soccer",
					"gym workout",
					"hiking",
					"pilates",
					"running",
					"slacklining",
					"surfing",
					"swimming",
					"tennis",
					"yoga",
				],
			},
			{
				type: "Food",
				lst: [
					"baking",
					"cooking",
					"eating outside",
					"interested in culinary",
					"interested in nutrition",
				],
			},
			{
				type: "Music",
				lst: [
					"playing drums",
					"playing guitar",
					"playing in a band",
					"playing piano",
					"playing synthesizer",
					"singing",
				],
			},
			{
				type: "Art",
				lst: [
					"acting",
					"fashion designing",
					"handicraft",
					"home decorating",
					"juggling",
					"painting",
				],
			},
			{
				type: "Knowledge",
				lst: [
					"blogging",
					"interested in medicine and biology",
					"learning new languages",
					"listening to podcasts",
					"playing chess",
					"puzzling",
					"reading",
					"writing",
				],
			},
			{
				type: "Technology",
				lst: ["coding", "hacking", "playing video games"],
			},
			{
				type: "Outside_Inside",
				lst: [
					"camping",
					"gardening",
					"sailing",
					"skippering",
					"shopping",
					"tanning",
					"traveling",
				],
			},
		],

		filters: {
			Search_Mode: [
				"Whatever",
				"Chill",
				"Jam",
				"Study",
				"Grab_A_Bite",
				"Hike",
				"Party",
				"Gaming",
				"Workout",
			],

			Gender: ["Gender", "Men", "Women", "All"],

			Interested_in: [
				"Interested in",
				"Friends",
				"Hookup",
				"Long term relationship",
				"Short term relationship",
				"Sport buddy",
				"Study buddy",
				"Work buddy",
			],
		},
	};
	res.send(constants);
};

getUsersAccordingToChosenExperiences = (req, res) => {
	const userid = req.params.userid;
	let searchMode, currentUser;
	const users = {
		Whatever: {},
		Chill: {},
		Jam: {},
		Study: {},
		Grab_A_Bite: {},
		Hike: {},
		Party: {},
		Gaming: {},
		Workout: {},
	};

	let onlineUsersId = [];
	onlineUsers.getOnlineUsersArray().forEach((onlineUser) => {
		onlineUsersId.push(onlineUser.user_id);
	});

	let useridArray = {
		params: {
			userid: String(onlineUsersId),
		},
	};

	getUserConfigurationInner(useridArray, userid, (response) => {
		for (user = 0; user < response.length; user++) {
			if (response[user].online === 1) {
				searchMode = response[user].search_mode;
				currentUser = response[user];
				users[searchMode][currentUser.user_id] = currentUser;
			}
		}

		res.send(users);
	});
};

module.exports = {
	getAllConstants,
	getUsersAccordingToChosenExperiences,
};
