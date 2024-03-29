const onlineUser = require("./onlineUser");
const {infoLogger} = require("../logger");

let onlineUsersArray = class {
	constructor() {
		this.onlineUsers = [];
		infoLogger.info("Online users array C'tor:");
	}

	async insertNewOnlineUser(user_id, websocket) {
		let isExists = 0;
		this.onlineUsers.forEach((onlineUser) => {
			if (parseInt(onlineUser.getUserId()) === parseInt(user_id)) {
				isExists = 1;
			}
		});

		if (isExists === 0) {
			const newOnlineUser = new onlineUser();
			await newOnlineUser.initOnlineUser(user_id, websocket);
			this.onlineUsers.push(newOnlineUser);
			infoLogger.info(
				`Insert a new online user - Inserting user_id = ${user_id} and his WS to the array!`
			);
		} else {
			infoLogger.info(
				`Insert a new online user - User id ${user_id} is already in the array. Didn't insert him again.`
			);
		}
	}

	removeAnOnlineUser(user_id) {
		this.onlineUsers.forEach((onlineUser) => {
			if (onlineUser.getUserId() === user_id) {
				infoLogger.info(
					"The ready state of ws:",
					onlineUser.websocket.readyState
				);
				if (
					onlineUser.websocket.readyState === 2 ||
					onlineUser.websocket.readyState === 3
				) {
					this.onlineUsers.splice(this.onlineUsers.indexOf(onlineUser), 1);
					infoLogger.info("Remove from online users array");
				}
			}
		});
	}

	getOnlineUsersArray() {
		return this.onlineUsers;
	}

	getOnlineUser(user_id) {
		let onlineUser = this.onlineUsers.find(
			(user) => parseInt(user.user_id) === parseInt(user_id)
		);

		return onlineUser;
	}

	includesAUser(user_id) {
		let isExists = 0;
		this.onlineUsers.forEach((onlineUser) => {
			if (parseInt(onlineUser.user_id) === parseInt(user_id)) {
				isExists = 1;
			}
		});

		return isExists;
	}

	async updateChatRoomOfUser(user_id, chatRoom) {
		const onlineUser = this.getOnlineUser(user_id);
		await onlineUser.updateOnlineUserChatRoomsArray(chatRoom);

		infoLogger.info(
			`---FROM ONLINE USERS **ARRAY**--- user's number: ${user_id} chat rooms array is now:\n${this.getOnlineUser(
				user_id
			).getAllUserChatRooms()}`
		);
	}

	getUserIdAccordingToWebSocket(ws) {
		let result = -1;
		this.onlineUsers.forEach((onlineUser) => {
			if (onlineUser.websocket === ws) {
				result = onlineUser.user_id;
			}
		});

		return result;
	}
};

class Singleton {
	constructor() {
		if (!Singleton.instance) {
			Singleton.instance = new onlineUsersArray();
		}
	}

	getInstance() {
		return Singleton.instance;
	}
}

module.exports = Singleton;
