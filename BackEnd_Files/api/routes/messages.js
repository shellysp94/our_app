const express = require("express");
const router = express.Router();

const {
	getChatMessages,
	createChatMessage,
	deleteChatMessages,
} = require("../controllers/messages");

router.get("/:chatID/:messagesOffset", getChatMessages); //TODO - convert to cb
router.post("/:useridA/:useridB", createChatMessage);
router.delete("/:chatID", deleteChatMessages); //TODO - convert to cb

module.exports = router;
