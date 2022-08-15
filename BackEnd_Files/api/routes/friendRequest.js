const express = require("express");
const router = express.Router();

const {
	getUserFriendRequestsSent,
	getUserFriendRequestsReceived,
	getAllUserConnectionsByName,
	getAllUserConnectionsType,
	sendFriendRequest,
	approveFriendRequest,
	declineFriendRequest,
} = require("../controllers/friendRequest");

router.get("/sendRequests/:userid", getUserFriendRequestsSent);
router.get("/receivedRequests/:userid", getUserFriendRequestsReceived);
router.get("/byName/:userid/:connected/:name", getAllUserConnectionsByName);
router.get("/byType/:userid/:type/:usersToPresent", getAllUserConnectionsType);
router.post("/send/:useridA/:useridB", sendFriendRequest);
router.post("/approve/:useridA/:useridB", approveFriendRequest);
router.delete("/decline/:useridA/:useridB", declineFriendRequest);

module.exports = router;
