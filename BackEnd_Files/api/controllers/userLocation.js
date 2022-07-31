const dbConfig = require('../../config/db_config');
const mySqlConnection = dbConfig;

module.exports = 
{
    getUserLocation: (req,res) =>
    {
        user_id = req.params.userid;
        mySqlConnection.query(`SELECT* from user_location where user_id=${user_id}`, (err,rows) => 
        {
            try
            {
                return res.send(rows);
            }

            catch(err)
            {
                console.log(err.message);
            }
        });
    },

    insertUserLocation: (req,res) =>
    {
        const user_id=req.params.userid;
        const longitude = req.body.longitude;
        const latitude = req.body.latitude;
        mySqlConnection.query(`INSERT INTO user_location (user_id, longitude, latitude) values (?,?,?)`,[user_id,longitude,latitude], (err,rows) =>
        {
            try
            {
                res.send(`Location added for user ${user_id}`);
            }

            catch(err)
            {
                console.log(err.message);
            }
        });
    },

    updateUserLocation: (req,res) =>
    {
        const user_id=req.params.userid;
        const longitude = req.body.longitude;
        const latitude = req.body.latitude;

        mySqlConnection.query(`UPDATE user_location SET longitude=?, latitude=?`,[longitude,latitude], (err,rows) =>
        {
            try
            {
                res.send(`Location updated for user ${user_id}`);
            }

            catch(err)
            {
                console.log(err.message);
            }
        });
    },

    deleteUserLocation: (req,res) =>
    {
        user_id = req.params.userid;

        mySqlConnection.query(`DELETE from user_location where user_id=${user_id}`, (err,rows) =>
        {
            try
            {
                res.send(`location of user ${user_id} deleted`);
            }

            catch(err)
            {
                console.log(err.message);
            }
        })
    }
};