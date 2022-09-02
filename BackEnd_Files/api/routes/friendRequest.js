const express = require("express");
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {
	getUserFriendRequestsSent,
	getUserFriendRequestsReceived,
	getAllUserConnectionsByName,
	getAllUserConnectionsType,
	sendFriendRequest,
	approveFriendRequest,
	declineFriendRequest,
} = require("../controllers/friendRequest");

router.get("/sendRequests/:userid",verifyToken, getUserFriendRequestsSent);
router.get("/receivedRequests/:userid",verifyToken, getUserFriendRequestsReceived);
router.get("/byName/:userid/:connected/:name",verifyToken, getAllUserConnectionsByName);
router.get("/byType/:userid/:type/:usersToPresent",verifyToken, getAllUserConnectionsType);
router.post("/send/:useridA/:useridB",verifyToken, sendFriendRequest);
router.post("/approve/:useridA/:useridB",verifyToken, approveFriendRequest);
router.delete("/decline/:useridA/:useridB",verifyToken, declineFriendRequest);

module.exports = router;
