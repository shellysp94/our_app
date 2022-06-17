const express = require("express");
const router = express.Router();

const {
	getAllChats,
	getUsersChat,
	createUsersChat,
	deleteUsersChat,
} = require("../controllers/chats");

router.get("/", getAllChats); //get all chats (/chats)
router.get("/:useridA/:useridB/:offset", getUsersChat); //get a chat by A_userid and B_userid (/chats/:useridA/:useridB)
router.post("/:useridA/:useridB", createUsersChat); //post a chat (/chats/:useridA/:useridB)
router.delete("/:useridA/:useridB", deleteUsersChat); //delete a chat (/chats/:useridA/:useridB)

module.exports = router;
