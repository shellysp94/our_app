const mysql=require('mysql');
require('dotenv').config({path:__dirname+'/../.env'})


const mySqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
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