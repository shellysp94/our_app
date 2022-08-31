const express = require("express");
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {createChatMessage} = require("../controllers/messages");

router.post("/:useridA/:useridB",verifyToken, createChatMessage);

module.exports = router;
