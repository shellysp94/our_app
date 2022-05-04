returnAllFiltersInSet = (req, res) => {
	let filters = {
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
					"interesting in nutrition",
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
		Search_Mode: [
			"Whatever",
			"Beer",
			"Study",
			"Food",
			"Training",
			"Coffee",
			"Shopping",
		],
		Gender: ["Gender", "Men", "Women", "All"],
		Relationship: [
			"Relationship",
			"Divorced",
			"Engaged",
			"In a relationship",
			"In an open relationship",
			"Married",
			"Single",
			"Widowed",
		],
		Interesting_In: [
			"Interesting in",
			"Friends",
			"Hookup",
			"Long term relationship",
			"Short term relationship",
			"Sport buddy",
			"Study buddy",
			"Work buddy",
		],
	};
	return res.send(filters);
};

module.exports = {returnAllFiltersInSet};
