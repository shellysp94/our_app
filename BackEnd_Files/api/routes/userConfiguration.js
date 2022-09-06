const express = require("express");
const {verifyToken} = require("../controllers/auth");
const router = express.Router();

const {
	getUserConfiguration,
	createUserConfiguration,
	deleteUserConfiguration,
	updateUserConfiguration,
} = require("../controllers/userConfiguration");

router.get("/:curr_userid/:userid", getUserConfiguration);
router.get("/:userid", getUserConfiguration);
// router.get(
// 	"/location/:user_id/:radius",
// 	verifyToken,
// 	getUsersConfigurationByRadius
// );
router.post("/:userid", verifyToken, createUserConfiguration);
router.delete("/:userid", verifyToken, deleteUserConfiguration);
router.put("/:userid", verifyToken, updateUserConfiguration);

module.exports = router;
