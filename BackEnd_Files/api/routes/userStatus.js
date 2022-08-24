const express = require("express");
const router = express.Router();

const {getUserStatus, updateUserStatus} = require("../controllers/userStatus");

router.get("/:userid", getUserStatus);
router.post("/:userid", updateUserStatus);

module.exports = router;
