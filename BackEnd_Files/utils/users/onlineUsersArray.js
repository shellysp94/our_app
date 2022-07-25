const onlineUser = require("./onlineUser");

let onlineUsersArray = class {
	constructor() {
		this.onlineUsers = [];

		console.log("Online users array ctor:");
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
			console.log(
				`Insert a new online user-\nInserting user_id = ${user_id} and his WS to the array!`
			);
		} else {
			console.log(
				`Insert a new online user-\nUser id ${user_id} is already in the array. Didn't insert him again.`
			);
		}

		//console.log(`Online users array\n${JSON.stringify(this)}`);
	}

	removeAnOnlineUser(user_id) {
		this.onlineUsers.forEach((onlineUser) => {
			if (onlineUser.getUserId() === user_id) {
				console.log("The ready state of ws:", onlineUser.websocket.readyState);
				if (
					onlineUser.websocket.readyState === 2 ||
					onlineUser.websocket.readyState === 3
				) {
					this.onlineUsers.splice(this.onlineUsers.indexOf(onlineUser), 1);
					console.log(
						"Remove from online users array:\n" + JSON.stringify(this)
					);
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

		console.log(
			`Get an online user with user_id = ${user_id} (from the array class):\n` +
				onlineUser
		);
		return onlineUser;
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
