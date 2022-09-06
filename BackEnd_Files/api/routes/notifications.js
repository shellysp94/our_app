const express = require("express");
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {
	getAllNotifications,
	getUserNotifications,
	getUserUnseenNotifications,
	updateSeenStatusNotification,
	deleteUserSeenNotifications,
} = require("../controllers/notifications");

router.get("/", getAllNotifications);
router.get("/:userid", verifyToken, getUserNotifications);
router.get("/unseen/:userid", verifyToken, getUserUnseenNotifications);
router.put("/:notification_id", verifyToken, updateSeenStatusNotification);
router.delete("/:userid", verifyToken, deleteUserSeenNotifications);

module.exports = router;
