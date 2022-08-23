const express = require("express");
const router = express.Router();

const {
	getUserStatus,
	createOrUpdateUserStatus,
	deleteUserStatus,
} = require("../controllers/userStatus");

router.get("/:userid", getUserStatus);
router.post("/:userid", createOrUpdateUserStatus);
router.put("/:userid", deleteUserStatus);

module.exports = router;
