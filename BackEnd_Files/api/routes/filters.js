const express = require("express");
const router = express.Router();

const {
	getAllFilters,
	getUserFilter,
	getFriendsOfFriends,
	getUserFilteredUsers,
	createUserFilter,
	deleteUserFilter,
} = require("../controllers/filters");

router.get("/", getAllFilters);
router.get("/:userid", getUserFilter);
router.get("/filteredUsers/:userid/:onlyOnline", getUserFilteredUsers);
router.get("/friendsOfFriends/:userid", getFriendsOfFriends);
router.post("/:userid/:onlyOnline", createUserFilter);
router.delete("/:userid", deleteUserFilter);

module.exports = router;
