const express = require("express");
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {
	getAllUsers,
	getOneUser,
	deleteUser,
	updateUser,
	getUsersByRadius,
} = require("../controllers/users");

router.get("/", getAllUsers); //get all users (/users/)
router.get("/:userid",verifyToken, getOneUser); //get user by userid (/users/:appid)
router.delete("/:userid",verifyToken, deleteUser); //delete user (/users/:appid)
router.put("/:userid",verifyToken, updateUser);
router.get("/locations/:radius",verifyToken, getUsersByRadius);

module.exports = router;
