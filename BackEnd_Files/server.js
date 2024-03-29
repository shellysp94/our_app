const { updateLocation } = require("./utils/websocket/locationWebSocket");
const { closingWebSocket } = require("./utils/websocket/closeWebSocket");
const onlineUsersArray = require("./utils/users/onlineUsersArray");
const { infoLogger, errLogger } = require("./utils/logger");
const publicToken = require("./config/auth_config");
const dbConfig = require("./config/db_config");
const { app, jwt } = require("./app");
const WebSocket = require("ws");
const http = require("http");
const port = process.env.PORT || 3000;
const mySqlConnection = dbConfig;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
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
    const token = req.headers.authorization.split(" ")[1];
    let userid;
    const rows = await myQuery(
      `select user_id from Users where token = "${token}"`
    );

    if (rows.length > 0) {
      userid = rows[0].user_id;
      jwt.verify(token, publicToken, async (err, payload) => {
        if (err) {
          errLogger.error(`Error: ${err.message}. connection closed`);
          ws.send(
            JSON.stringify({ msg: `Error: ${err.message}. connection closed` })
          );
          ws.close();
        } else {
          await onlineUsers.insertNewOnlineUser(userid, ws);

          wss.clients.forEach((client) => {
            if (client !== ws) {
              client.send(JSON.stringify({ msg: "New User Connected" }));
            }
          });

          infoLogger.info("Online Users Array Updated");
        }
      });
    } else {
      errLogger.error("Token Illegal. Connection Closed");
      ws.send(JSON.stringify({ msg: "Token illegal. connection closed" }));
      ws.close();
    }
  } catch (err) {
    errLogger.error(`Server - connection to WS, error\n${err}`);
    ws.close();
  }

  ws.on("message", (message) => {
    updateLocation(onlineUsers, message, ws);
  });

  ws.on("close", () => {
    closingWebSocket(onlineUsers, ws);
    wss.clients.forEach((client) =>
      client.send(JSON.stringify({ msg: "User Disconnected" }))
    );
  });
});

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
