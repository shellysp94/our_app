const express = require("express");
const router = express.Router();

const {getChatMessages, createChatMessage} = require("../controllers/messages");

router.get("/:chatID/:messagesOffset", getChatMessages);
router.post("/:chatID/:sender/:receiver", createChatMessage);

module.exports = router;