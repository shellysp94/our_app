const chatRoomsArray = require("../chatRooms/chatRoomsArray");
const chatRooms = new chatRoomsArray().getInstance().getChatRoomsArray();

let onlineUser = class {
	constructor(user_id, websocket) {
		this.user_id = user_id;
		this.websocket = websocket;
		this.userChatRooms = chatRooms.filter(
			(chatRoom) =>
				chatRoom.getUser_A_id() === parseInt(user_id, 10) ||
				chatRoom.getUser_B_id() === parseInt(user_id, 10)
		);
	}

	getUserId() {
		return this.user_id;
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
