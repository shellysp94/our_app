const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const chatRoom = require("./chatRoom");

getAllChatsInDatabase = (callback) => {
	mySqlConnection.query(
		"SELECT chat_id, user_A_id, user_B_id from Chats",
		(err, rows) => {
			try {
				return callback(rows);
			} catch (err) {
				console.log(err.message);
			}
		}
	);
};

let chatRoomsArray = class {
	constructor() {
		this.chatRooms = [];
		getAllChatsInDatabase((response) => {
			response.forEach((chatRoom) => {
				this.insertNewChatRoom(
					chatRoom.chat_id,
					chatRoom.user_A_id,
					chatRoom.user_B_id
				);
			});
		});
	}

	insertNewChatRoom(chat_id, user_A_id, user_B_id) {
		const newChatRoom = new chatRoom(chat_id, user_A_id, user_B_id);
		if (!this.chatRooms.includes(newChatRoom)) {
			this.chatRooms.push(newChatRoom);
		}
	}

	getChatRoomsArray() {
		return this.chatRooms;
	}

	getChatRoom(chat_id) {
		return this.chatRooms.find((chat) => chat.chat_id === chat_id);
	}
};

class Singleton {
	constructor() {
		if (!Singleton.instance) {
			Singleton.instance = new chatRoomsArray();
		}
	}

	getInstance() {
		return Singleton.instance;
	}
}

module.exports = Singleton;
