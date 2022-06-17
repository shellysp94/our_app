const onlineUser = require("./onlineUser");

let onlineUsersArray = class {
	constructor() {
		this.onlineUsers = [];
	}

	insertNewOnlineUser(user_id, websocket) {
		const newOnlineUser = new onlineUser(user_id, websocket);
		if (!this.onlineUsers.includes(newOnlineUser)) {
			this.onlineUsers.push(newOnlineUser);
		}
	}

	removeAnOnlineUser(user_id) {
		this.onlineUsers.forEach((onlineUser) => {
			if (onlineUser.getUserId() === user_id) {
				this.onlineUsers.splice(this.onlineUsers.indexOf(onlineUser), 1);
			}
		});
	}

	getOnlineUsersArray() {
		return this.onlineUsers;
	}

	getOnlineUser(user_id) {
		return this.onlineUsers.find(
			(user) => user.user_id === parseInt(user_id, 10)
		);
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
