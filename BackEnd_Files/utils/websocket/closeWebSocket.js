const { info } = require("winston");
const { infoLogger } = require("../logger");

function closingWebSocket(onlineUsers, ws) {
  infoLogger.info(`Closing Websocket`);

  onlineUsers.getOnlineUsersArray().forEach((user) => {
    infoLogger.info("***************if condition: ", user.websocket === ws);
    if (user.websocket === ws) {
      infoLogger.info("********inside IF**********");
      infoLogger.info(`User ${user.user_id} Websocket Closed`);
      onlineUsers.removeAnOnlineUser(user.user_id);
    }
  });
}

module.exports = { closingWebSocket: closingWebSocket };
