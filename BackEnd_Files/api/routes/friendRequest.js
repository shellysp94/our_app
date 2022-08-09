const express = require("express");
const router = express.Router();

const {
	getUserFriendRequestsSent,
	getUserFriendRequestsReceived,
	getMyFriends,
	sendFriendRequest,
	approveFriendRequest,
	declineFriendRequest,
	getAllUserConnectionsByName,
	getAllUserConnectionsType,
} = require("../controllers/friendRequest");

router.get("/sendRequests/:userid", getUserFriendRequestsSent); //get user friend requests
router.get("/receivedRequests/:userid", getUserFriendRequestsReceived); //get user friend requests
//router.get("/myFriends/:userid", getMyFriends); //get user friend requests
router.post("/send/:useridA/:useridB", sendFriendRequest);
router.post("/approve/:useridA/:useridB", approveFriendRequest);
router.delete("/decline/:useridA/:useridB", declineFriendRequest);
router.get("/byName/:userid/:connected/:name", getAllUserConnectionsByName);
router.get("/byType/:userid/:type/:usersToPresent", getAllUserConnectionsType);

module.exports = router;
