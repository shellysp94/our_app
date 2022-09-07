const {
  sendNotificationHelper,
} = require("../../utils/notifications/notifications");
const onlineUsersArray = require("../../utils/users/onlineUsersArray");
const dbConfig = require("../../config/db_config");
const onlineUsers = new onlineUsersArray().getInstance();
const mySqlConnection = dbConfig;
const { infoLogger, errLogger } = require("../../utils/logger");

getChatMessages = (req, cb) => {
  infoLogger.info("This is an info log");
  const chatID = req.params.chatID;
  const messagesOffset = req.params.messagesOffset;

  mySqlConnection.query(
    `select * from (select * from Messages where chat_id = ${chatID} limit 50 offset ${messagesOffset}) as T1 order by creation_date asc`,
    (err, rows) => {
      return cb(rows);
    }
  );
};

createChatMessage = (req, res) => {
  infoLogger.info("This is an info log");
  const sender = req.params.useridA;
  const receiver = req.params.useridB;
  const content = req.body.content;
  const senderOnlineUser = onlineUsers.getOnlineUser(sender);
  const receiverOnlineUser = onlineUsers.getOnlineUser(receiver);

  try {
    if (senderOnlineUser === undefined) {
      throw new Error(
        "Messages - POST send a new message. Sender isn't online to WS"
      );
    }

    const currentChatRoom = onlineUsers
      .getOnlineUser(senderOnlineUser.user_id)
      .getAUserChatRoom(receiver)[0];

    if (currentChatRoom === undefined) {
      throw new Error(
        "Messages - POST send a new message. Chat room isn't exist in the DB"
      );
    }

    const chatID = currentChatRoom.chat_id;

    mySqlConnection.query(
      `insert into Messages (chat_id, creation_date, sender_user_id, receiver_user_id, content) values (${chatID}, current_timestamp(), ${sender}, ${receiver}, "${content}")`,
      (err, rows) => {
        try {
          if (err || rows === undefined || rows.affectedRows < 1) {
            throw new Error("Messages - POST a new message, MySQL Error");
          } else {
            const titleToSend = "You got a new message";
            const bodyToSend = "New message from ";
            //sendNotificationHelper(req, res, titleToSend, bodyToSend);

            mySqlConnection.query(
              `select * from Messages where chat_id = ${chatID} order by creation_date desc limit 1`,
              (err, rows) => {
                try {
                  if (err || rows === undefined || rows.length === 0) {
                    throw new Error(
                      "Messages - Get the last message that sent failed. MySQL Error"
                    );
                  } else {
                    if (receiverOnlineUser !== undefined) {
                      // Sender and Receiver are online. Both got the message on WS
                      senderOnlineUser.websocket.send(JSON.stringify(rows[0]));
                      receiverOnlineUser.websocket.send(
                        JSON.stringify(rows[0])
                      );
                    } else {
                      // Only sender is online and got the message on WS
                      senderOnlineUser.websocket.send(JSON.stringify(rows[0]));
                    }
                    res.send(rows[0]);
                  }
                } catch (err) {
                  throw err;
                }
              }
            );
          }
        } catch (err) {
          throw err;
        }
      }
    );
  } catch (err) {
    errLogger.error("Messages - POST MySQL Error", { err });
    return res.status(500).send("internal error");
  }
};

deleteChatMessages = (req, cb) => {
  infoLogger.info("This is an info log");
  const chatID = req.params.chatID;

  mySqlConnection.query(
    `delete from Messages where chat_id = ${chatID}`,
    (err, rows) => {
      if (err || rows === undefined) {
        return cb(rows);
      } else {
        msgToClient = {
          msg: `Chat room number ${chatID} is empty`,
        };
        return cb(msgToClient);
      }
    }
  );
};

module.exports = {
  getChatMessages,
  createChatMessage,
  deleteChatMessages,
};
