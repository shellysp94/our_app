const express = require("express");
const router = express.Router();

const {
  getAllNotifications,
  getUserNotifications,
  getUserUnseenNotifications,
  updateSeenStatusNotification,
  deleteUserSeenNotifications,
} = require("../controllers/notifications");

router.get("/", getAllNotifications);
router.get("/:userid", getUserNotifications);
router.get("/unseen/:userid", getUserUnseenNotifications);
router.put("/:notification_id", updateSeenStatusNotification);
router.delete("/:userid", deleteUserSeenNotifications);

module.exports = router;