const express = require("express");
const router = express.Router();

const {
	getAllChats,
	getSpecificUserChats,
	getUsersChat,
	createUsersChat,
	deleteUsersChat,
} = require("../controllers/chats");

router.get("/", getAllChats);
router.get("/:userid", getSpecificUserChats);
router.get("/:useridA/:useridB/:offset", getUsersChat);
router.post("/:useridA/:useridB", createUsersChat);
router.delete("/:useridA/:useridB", deleteUsersChat);

module.exports = router;
