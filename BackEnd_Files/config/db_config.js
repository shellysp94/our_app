const mysql=require('mysql');

const mySqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    //database: "users_db_updated"
    database: "users_db"
});

mySqlConnection.connect((err)=>
{
    if(err)
    {
        console.log("Error:" + err.message);
    }
    else
    {
        console.log("connected");
    }
})

module.exports = mySqlConnection;