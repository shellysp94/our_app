const mysql=require('mysql');
require('dotenv').config({path:__dirname+'/../.env'})


const mySqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_NAME,
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