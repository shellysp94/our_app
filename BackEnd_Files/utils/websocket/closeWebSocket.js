const { infoLogger } = require("../logger");

function closingWebSocket(onlineUsers, ws) {
  infoLogger.info("--------------Closing Websocket-------------");
  onlineUsers.getOnlineUsersArray().forEach((user) => {
    //console.log("the compare of ws:", user.websocket === ws);
    if (user.websocket === ws) {
      onlineUsers.removeAnOnlineUser(user.user_id);
      //console.log(`user number ${user.user_id} disconnected`);
    }
  });
}

module.exports = { closingWebSocket: closingWebSocket };
