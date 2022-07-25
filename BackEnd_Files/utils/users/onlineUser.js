const chatRoomsArray = require("../chatRooms/chatRoomsArray");
const chatRooms = new chatRoomsArray().getInstance().getChatRoomsArray();
const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

function getUserName(user_id) {
	return new Promise((resolve, reject) => {
		mySqlConnection.query(
			`select first_name from user_configuration where user_id = ${user_id}`,
			(err, rows) => {
				if (err) {
					reject(err);
				}
				if (rows === undefined || rows.length === 0) {
					console.log(
						"something wrong. This user id didn't exist in the database"
					);
					resolve("");
				} else {
					resolve(rows[0].first_name);
				}
			}
		);
	});
	// mySqlConnection.query(
	// 	`select first_name from user_configuration where user_id = ${user_id}`,
	// 	(err, rows) => {
	// 		if (typeof rows === "undefined" || rows.length === 0) {
	// 			console.log(
	// 				"something wrong. This user id didn't exist in the database"
	// 			);
	// 			return callback();
	// 		} else {
	// 			return callback(rows[0].first_name);
	// 		}
	// 	}
	// );
}

let onlineUser = class {
	constructor() {
		this.user_id;
		this.user_name;
		this.websocket;
		this.userChatRooms;
		console.log("C'tor of online user");
		// getUserName(user_id, (userName) => {
		// 	this.user_id = user_id;
		// 	this.user_name = userName;
		// 	this.websocket = websocket;
		// 	this.userChatRooms = chatRooms.filter(
		// 		(chatRoom) =>
		// 			chatRoom.getUser_A_id() === parseInt(user_id, 10) ||
		// 			chatRoom.getUser_B_id() === parseInt(user_id, 10)
		// 	);
		// 	console.log(`C'tor of user: ${user_id} create an online user!`);
		// console.log(
		// 	`Online User C'tor --> create online user with id: ${user_id}.\nThe object is: ${JSON.stringify(
		// 		this
		// 	)}`
		// );
		//});
	}

	async initOnlineUser(user_id, websocket) {
		const userName = await getUserName(user_id);
		this.user_id = user_id;
		this.user_name = userName;
		this.websocket = websocket;
		this.userChatRooms = chatRooms.filter(
			(chatRoom) =>
				chatRoom.getUser_A_id() === parseInt(user_id, 10) ||
				chatRoom.getUser_B_id() === parseInt(user_id, 10)
		);
		console.log(`C'tor of user: ${user_id} create an online user!`);
	}

	updateOnlineUserChatRooms() {
		console.log(`Update chat rooms array of user: ${this.user_id}`);
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
