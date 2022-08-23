const express = require("express");
const router = express.Router();

const {createChatMessage} = require("../controllers/messages");

router.post("/:useridA/:useridB", createChatMessage);

module.exports = router;
