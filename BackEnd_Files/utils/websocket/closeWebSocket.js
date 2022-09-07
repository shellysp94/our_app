const { info } = require("winston");
const { infoLogger } = require("../logger");

function closingWebSocket(onlineUsers, ws) {
  infoLogger.info(`Closing Websocket`);
  onlineUsers.getOnlineUsersArray().forEach((user) => {
    if (user.websocket === ws) {
      infoLogger.info(`User ${user.user_id} Websocket Closed`);
      onlineUsers.removeAnOnlineUser(user.user_id);
      ws.send(`User Disconnected`);
    }
  });
}

module.exports = { closingWebSocket: closingWebSocket };
