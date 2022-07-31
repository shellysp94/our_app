const onlineUsersArray = require("./utils/users/onlineUsersArray");
const publicToken = require("./config/auth_config");
const dbConfig = require("./config/db_config");
const {app, jwt} = require("./app");
const WebSocket = require("ws");
const http = require("http");
// const url = require("url");
const {closingWebSocket} = require("./utils/websocket/closeWebSocket");
const {updateLocation} = require("./utils/websocket/locationWebSocket");
const port = process.env.PORT || 3000;
const mySqlConnection = dbConfig;
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const onlineUsers = new onlineUsersArray().getInstance();

const myQuery = (query) => {
	return new Promise((resolve, reject) => {
		mySqlConnection.query(query, (err, rows) => {
			if (err) {
				reject(err);
			}
			resolve(rows);
		});
	});
};

wss.on("connection", async (ws, req) => {
	try {
		//let token = url.parse(req.url, true).query.token;
		const token = req.headers.authorization.split(" ")[1];
		let userid;
		const rows = await myQuery(
			`select user_id from users where token = "${token}"`
		);
		if (rows.length > 0) {
			userid = rows[0].user_id;
			console.log("user id:", userid);
			jwt.verify(token, publicToken, async (err, payload) => {
				if (err) {
					console.log(`Error: ${err.message}. connection closed`);
					ws.close();
				} else {
					await onlineUsers.insertNewOnlineUser(userid, ws);
					console.log("--------------------------------------------");
					console.log("Online users array is now:\n");
					console.log("--------------------------------------------");
					console.log(onlineUsers);
				}
			});
		} else {
			console.log("Token illegal. connection closed");
			ws.close();
		}
	} catch (e) {
		console.log(e.message);
	}

	ws.on("message", (message) => {
		//console.log(`Received message => ${message} `);
		updateLocation(onlineUsers, message, ws);

	});

	ws.on("close", () => {
		closingWebSocket(onlineUsers, ws);
		// console.log(
		// 	"online users array from server close ws:",
		// 	JSON.stringify(onlineUsers)
		// );
	});
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/new_index.html");
});

server.listen(port, () => {
	console.log(`server running on port ${port}`);
});
