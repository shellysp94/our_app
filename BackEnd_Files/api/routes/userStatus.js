const express = require("express");
const router = express.Router();
const {verifyToken} = require("../controllers/auth");
const {getUserStatus, updateUserStatus} = require("../controllers/userStatus");

router.get("/:userid",verifyToken, getUserStatus);
router.post("/:userid",verifyToken, updateUserStatus);

module.exports = router;
