const express = require("express");
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {
	getAllFilters,
	getUserFilter,
	getFriendsOfFriends,
	getUserFilteredUsers,
	createUserFilter,
	deleteUserFilter,
} = require("../controllers/filters");

router.get("/", getAllFilters);
router.get("/:userid",verifyToken, getUserFilter);
router.get("/filteredUsers/:userid/:onlyOnline",verifyToken, getUserFilteredUsers);
router.get("/friendsOfFriends/:userid",verifyToken, getFriendsOfFriends);
router.post("/:userid/:onlyOnline",verifyToken, createUserFilter);
router.delete("/:userid",verifyToken, deleteUserFilter);

module.exports = router;
