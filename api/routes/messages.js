const express = require("express");
const router = express.Router();

const {
	getChatMessages,
	createChatMessage,
	deleteChatMessages,
} = require("../controllers/messages");

router.get("/:chatID/:messagesOffset", getChatMessages);
router.post("/:chatID/:sender/:receiver", createChatMessage);
router.delete("/:chatID", deleteChatMessages);

module.exports = router;
