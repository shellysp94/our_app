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

        mySqlConnection.query(`SELECT* from user_location where user_id=${user_id}`, (err,rows) =>
        {
            try
            {
                if(rows.length > 0)
                {
                    mySqlConnection.query(`UPDATE user_location SET longitude=${longitude}, latitude=${latitude} where user_id=${user_id}`, (newErr,newEows) =>
                    {
                        try
                        {
                            res.send(`Location updated for user ${user_id}`);
                        }

                        catch(newErr)
                        {
                            console.log(newErr.message);
                        }
                    });
                }

                else
                {
                    mySqlConnection.query(`INSERT INTO user_location (user_id, longitude, latitude) values (?,?,?)`,[user_id,longitude,latitude], (newErr,newRows) =>
                    {
                        try
                        {
                            res.send(`Location added for user ${user_id}`);
                        }

                        catch(newErr)
                        {
                            console.log(newErr.message);
                        }
                    });
                }
            }

            catch(err)
            {
                console.log(err.message);
            }
        })
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

    //cb for WS
    // insertUserLocation: (req,cb) =>
    // {
    //     const user_id=req.params.userid;
    //     const longitude = req.params.longitude;
    //     const latitude = req.params.latitude;
    //     mySqlConnection.query(`INSERT INTO user_location (user_id, longitude, latitude) values (?,?,?)`,[user_id,longitude,latitude], (err,rows) =>
    //     {
    //         try
    //         {
    //             cb(`Location added for user ${user_id}`);
    //         }

    //         catch(err)
    //         {
    //             console.log(err.message);
    //         }
    //     });
    // },

    //cb for WS
    // updateUserLocation: (req,cb) =>
    // {
    //     const user_id=req.params.userid;
    //     const longitude = req.params.longitude;
    //     const latitude = req.params.latitude;

    //     mySqlConnection.query(`UPDATE user_location SET longitude=?, latitude=? where user_id=?`,[longitude,latitude,user_id], (err,rows) =>
    //     {
    //         try
    //         {
    //             cb(`Location updated for user ${user_id}`);
    //         }

    //         catch(err)
    //         {
    //             console.log(err.message);
    //         }
    //     });
    // },

    