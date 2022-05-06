const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;

module.exports = {
  getAllChats: (req, res) => {
    mySqlConnection.query("SELECT * from Chats", (err, rows) => {
      try {
        res.send(rows);
      } 
      catch (err) {
        console.log(err.message);
      }
    });
  },

  getUsersChat: (req, res) => {
    const userIdA = req.params.useridA;
    const userIdB = req.params.useridB;
    mySqlConnection.query(
      "SELECT * FROM Chats WHERE user_A_id = ? AND user_B_id = ?",
      [userIdA, userIdB],
      (err, rows) => {
        try {
          res.send(rows);
        } 
        catch (err) {
          console.log(err.message);
        }
      }
    );
  },

  createUsersChat: (req, res) => {
    const currentDate = new Date();
    const userIdA = req.params.useridA;
    const userIdB = req.params.useridB;

    mySqlConnection.query(
      `select * from connections where (user_A_id = ${userIdA} and user_B_id = ${userIdB} and connected = 1)`,
      (err, rows) => {
        try {
          if(rows.length > 0)
          {
            mySqlConnection.query(
              "INSERT INTO Chats (create_date, user_A_id, user_B_id) values (?, ?, ?)" +
                "ON DUPLICATE KEY UPDATE user_A_id = ?, user_B_id = ?",
              [currentDate, userIdA, userIdB, userIdA, userIdB],
              (err, rows) => {
                try {
                  mySqlConnection.query(
                    `select first_name from user_configuration where user_id = ${userIdA} or user_id = ${userIdB}`,
                    (err, rows) => {
                      try {
                        const user_A_Name = rows[0].first_name;
                        const user_B_Name = rows[1].first_name;
                        msgToClient = {msg: `Chat between ${user_A_Name} and ${user_B_Name} is now exists, lets talk!`};
                        return res.send(msgToClient);
                      } 
                      catch (err) {
                        console.log(err.message);
                      }
                    }
                  )
                } catch (err) {
                  console.log(err.message);
                }
              }
            )
          }
          else 
          {
            msgToClient = {msg: `Chat not added. There is no mutual connection between users ${userIdA} and ${userIdB}.`};
            return res.send(msgToClient);
            // res.send(`Chat not added. There is no mutual connection between users ${userIdA} and ${userIdB}.`);
          }
        } 
        catch (err) {
          console.log(err.message);
        }
      }
    )
  },

  deleteUsersChat: (req, res) => {
    const userIdA = req.params.useridA;
    const userIdB = req.params.useridB;

    mySqlConnection.query(
      "DELETE FROM Chats WHERE user_A_id = ? AND user_B_id = ?",
      [userIdA, userIdB],
      (err, rows) => {
        try 
        {
          mySqlConnection.query(
            `select first_name from user_configuration where user_id = ${userIdA} or user_id = ${userIdB}`,
            (err, rows) => {
              try {
                const user_A_Name = rows[0].first_name;
                const user_B_Name = rows[1].first_name;
                msgToClient = {msg: `Chat between ${user_A_Name} and ${user_B_Name} deleted successfully`};
                return res.send(msgToClient);
              } 
              catch (err) {
                console.log(err.message);
              }
            }
          )
        } 
        catch (err) {
          console.log(err.message);
        }
      }
    );
  },
};