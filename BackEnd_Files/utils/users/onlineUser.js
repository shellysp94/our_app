const chatRoomsArray = require("../chatRooms/chatRoomsArray");
const chatRooms = new chatRoomsArray().getInstance().getChatRoomsArray();
const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

function getUserName(user_id, callback) {
	mySqlConnection.query(
		`select first_name from user_configuration where user_id = ${user_id}`,
		(err, rows) => {
			if (typeof rows === "undefined" || rows.length === 0) {
				console.log(
					"something wrong. This user id didn't exist in the database"
				);
				return callback();
			} else {
				return callback(rows[0].first_name);
			}
		}
	);
}

let onlineUser = class {
	constructor(user_id, websocket) {
		getUserName(user_id, (userName) => {
			this.user_id = user_id;
			this.user_name = userName;
			this.websocket = websocket;
			this.userChatRooms = chatRooms.filter(
				(chatRoom) =>
					chatRoom.getUser_A_id() === parseInt(user_id, 10) ||
					chatRoom.getUser_B_id() === parseInt(user_id, 10)
			);
		});
	}

	getUserId() {
		return this.user_id;
	}

	getUserName() {
		return this.user_name;
	}

	getWebSocket() {
		return this.websocket;
	}

	getAllUserChatRooms() {
		return this.userChatRooms;
	}

	getAUserChatRoom(other_user_id) {
		return this.userChatRooms.filter(
			(chatRoom) =>
				chatRoom.getUser_A_id() === parseInt(other_user_id, 10) ||
				chatRoom.getUser_B_id() === parseInt(other_user_id, 10)
		);
	}

	insertNewChatRoom(chatRoom) {
		this.userChatRooms.push(chatRoom);
	}
};

module.exports = onlineUser;
