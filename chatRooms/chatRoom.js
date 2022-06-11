let ChatRoom = class {
	constructor(chat_id, user_A_id, user_B_id) {
		this.chat_id = chat_id;
		this.user_A_id = user_A_id;
		this.user_B_id = user_B_id;
	}

	getChatId() {
		return this.chat_id;
	}

	getUser_A_id() {
		return this.user_A_id;
	}

	getUser_B_id() {
		return this.user_B_id;
	}
};

module.exports = ChatRoom;
