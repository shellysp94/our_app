const express = require("express");
const router = express.Router();

const {
	getAllConnections,
	getAllConnectedConnections,
	getUsersConnection,
	getAllUserConnections,
	getAllUserConnectedConnections,
	getAllUserConnectionsByName,
	createUsersConnection,
	deleteUsersConnection,
} = require("../controllers/connections");

router.get("/", getAllConnections); //get all chats (/chats)
router.get("//connected", getAllConnectedConnections); //get a chat by A_userid and B_userid (/chats/:useridA/:useridB)
router.get("/:useridA/:useridB", getUsersConnection);
router.get("/:userid", getAllUserConnections);
router.get("//connected/:userid", getAllUserConnectedConnections);
router.get("//byName/:userid/:connected", getAllUserConnectionsByName);
router.post("/:useridA/:useridB", createUsersConnection); //post a chat (/chats/:useridA/:useridB)
router.delete("/:useridA/:useridB", deleteUsersConnection); //delete a chat (/chats/:useridA/:useridB)

module.exports = router;
