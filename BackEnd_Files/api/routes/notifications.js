const express = require("express");
const router = express.Router();

const {
  getAllNotifications,
  getUserNotifications,
  getUserUnseenNotifications,
  getAllNotificationsSendingFrom,
  createUserNotification,
  updateSeenStatusNotification,
  deleteUserSeenNotifications,
} = require("../controllers/notifications");

router.get("/", getAllNotifications);
router.get("/:userid", getUserNotifications);
router.get("//unseen/:userid", getUserUnseenNotifications);
router.get("//sendingFrom/:userid", getAllNotificationsSendingFrom);
router.post("/:userid/:sentFrom", createUserNotification);
router.put("/:notificationID/:seen", updateSeenStatusNotification);
router.delete("/:userid", deleteUserSeenNotifications);

module.exports = router;