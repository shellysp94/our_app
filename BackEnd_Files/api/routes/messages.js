const express = require("express");
const router = express.Router();

const {
	getChatMessages,
	createChatMessage,
	deleteChatMessages,
} = require("../controllers/messages");

router.get("/:chatID/:messagesOffset", getChatMessages);
router.post("/:useridA/:useridB", createChatMessage);
router.delete("/:chatID", deleteChatMessages);

module.exports = router;
