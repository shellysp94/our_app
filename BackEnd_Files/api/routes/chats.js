const express = require("express");
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {
	getAllChats,
	getSpecificUserChats,
	getUsersChat,
	createUsersChat,
	deleteUsersChat,
} = require("../controllers/chats");

router.get("/",verifyToken, getAllChats); //NOTE - not in use, delete later
router.get("/:userid",verifyToken, getSpecificUserChats);
router.get("/:useridA/:useridB/:offset",verifyToken, getUsersChat);
router.post("/:useridA/:useridB",verifyToken, createUsersChat);
router.delete("/:useridA/:useridB",verifyToken, deleteUsersChat);

module.exports = router;
