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

wss.on("connection", (ws, req) => {
	const token = req.headers.authorization.split(" ")[1];
	//let token = url.parse(req.url, true).query.token;
	let userid;

	mySqlConnection.query(
		`select user_id from users where token = "${token}"`,
		(err, rows) => {
			try {
				if (rows.length > 0) {
					userid = rows[0].user_id;
					jwt.verify(token, publicToken, (err, payload) => {
						if (err) {
							console.log(`Error: ${err.message}. connection closed`);
							ws.close();
						} else {
							onlineUsers.insertNewOnlineUser(userid, ws);
							console.log(`user number ${userid} connected`);
						}
					});
				} else {
					console.log("Token illegal. connection closed");
					ws.close();
				}
			} catch (err) {
				console.log(err.message);
			}
		}
	);

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
