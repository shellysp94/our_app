const express = require("express");
const router = express.Router();

const {
	getAllFilters,
	getUserFilter,
	getFriendsOfFriends,
	//getUsersWithCommonAgeFilter,
	getUserFriendsThatFilteredFriendsOnly,
	getUserFilteredUsers,
	createUserFilter,
	deleteUserFilter,
} = require("../controllers/filters");

router.get("/", getAllFilters);
router.get("/:userid", getUserFilter);
router.get("//friendsOfFriends/:userid", getFriendsOfFriends);
//router.get("//age", getUsersWithCommonAgeFilter);
router.get("//friendsOnly/:userid", getUserFriendsThatFilteredFriendsOnly);
router.get("//filteredUsers/:userid/:onlyOnline", getUserFilteredUsers);
router.post("/:userid/:onlyOnline", createUserFilter);
router.delete("/:userid", deleteUserFilter);

module.exports = router;
