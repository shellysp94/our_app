const { response } = require("express");
const { getUserConfigurationInner } = require("./userConfiguration");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const onlineUsers = new onlineUsersArray().getInstance();
const { infoLogger, errLogger } = require("../../utils/logger");

const getAllConstants = (req, res) => {
  infoLogger.info("This is an info log");
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
          "graffiti painting",
          "shooting",
        ],
      },
      {
        type: "Intelligence",
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
        type: "Tech",
        lst: ["coding", "hacking", "playing video games"],
      },
      {
        type: "Outdoor",
        lst: [
          "camping",
          "gardening",
          "sailing",
          "skippering",
          "tanning",
          "traveling",
          "having a picnic",
        ],
      },
      {
        type: "Indoor",
        lst: ["shopping", "museums", "theaters", "movies"],
      },
    ],

    filters: {
      Search_Mode: [
        "Chill",
        "Jam",
        "Study",
        "Grab A Bite",
        "Surprise",
        "Hike",
        "Party",
        "Gaming",
        "Workout",
        "Whatever",
      ],

      Gender: ["Gender", "Men", "Women", "prefer not to say", "All"],

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
    "Search Mode Sentences": {
      Chill: "Let's Chill?",
      Jam: "Let's Jam?",
      Study: "Let's Study?",
      "Grab A Bite": "Let's Grab A Bite?",
      Surprise: "Surprise Me!",
      Hike: "Let's Hike?",
      Party: "Let's Party?",
      Gaming: "Let's Play?",
      Workout: "Let's Workout?",
      Whatever: "Doesn't matter as long as we do it together!",
    },
  };
  res.send(constants);
};

getUsersAccordingToChosenExperiences = (req, res) => {
  infoLogger.info("This is an info log");
  const userid = req.params.userid;
  let searchMode, currentUser;
  const users = {
    Whatever: [],
    Chill: [],
    Jam: [],
    Study: [],
    "Grab A Bite": [],
    Hike: [],
    Party: [],
    Gaming: [],
    Workout: [],
  };

  // initializing the online users' ID array without myself
  let onlineUsersId = [];
  onlineUsers.getOnlineUsersArray().forEach((onlineUser) => {
    if (parseInt(onlineUser.user_id, 10) !== parseInt(userid, 10)) {
      onlineUsersId.push(onlineUser.user_id);
    }
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
        users[searchMode].push(currentUser);
      }
    }

    res.send(users);
  });
};

module.exports = {
  getAllConstants,
  getUsersAccordingToChosenExperiences,
};
