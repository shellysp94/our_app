const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const chatRoom = require("./chatRoom");
const logger = require("../logger");

function getAllChatsInDatabase(callback) {
  mySqlConnection.query(
    "SELECT chat_id, user_A_id, user_B_id from Chats",
    (err, rows) => {
      try {
        return callback(rows);
      } catch (err) {
        console.log(err.message);
      }
    }
  );
}

let chatRoomsArray = class {
  constructor() {
    this.chatRooms = [];
    getAllChatsInDatabase((response) => {
      response.forEach((chatRoom) => {
        this.insertNewChatRoom(
          chatRoom.chat_id,
          chatRoom.user_A_id,
          chatRoom.user_B_id
        );
      });
    });
    //console.log("C'tor of Chat Rooms Array");
    logger.info("C'tor of Chat Rooms Array");
  }

  insertNewChatRoom(chat_id, user_A_id, user_B_id) {
    let isExists = 0;
    this.chatRooms.forEach((chatRoom) => {
      if (parseInt(chat_id) === parseInt(chatRoom.getChatId())) {
        isExists = 1;
      }
    });

    if (isExists === 0) {
      const newChatRoom = new chatRoom(chat_id, user_A_id, user_B_id);
      this.chatRooms.push(newChatRoom);
    }
  }

  getChatRoomsArray() {
    return this.chatRooms;
  }

  getChatRoom(chat_id) {
    return this.chatRooms.find((chat) => chat.chat_id === chat_id);
  }
};

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new chatRoomsArray();
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}

module.exports = Singleton;
