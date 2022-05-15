const { app, jwt } = require('../../app');
const dbConfig = require('../../config/db_config');
var configuration = require('../controllers/userConfiguration');
const publicToken= require('../../config/auth_config');
const bcrypt = require("bcrypt");
const mySqlConnection = dbConfig;


module.exports={
    
    login: async (req,res) => {
        // Read username and password from request body
        const email=req.body.email;
        const password=req.body.password;

        mySqlConnection.query("SELECT* from users WHERE email=?", [email], (err, rows) => {
            if (rows.length===0)   // user not exist
            {
                msgToClient={msg: "user not exist"};
                return res.send(msgToClient);
            }

            else 
            { //user exist
                var resultArray = Object.values(JSON.parse(JSON.stringify(rows)))
                var dbPass = resultArray[0].password;

                bcrypt.compare(password, dbPass, (err, result) => 
                {
                    if (err)
                    {
                       return res.send(err);
                    }

                    if(result)
                    {
                        const accessToken = jwt.sign(
                            { user_id: resultArray[0].user_id},
                            publicToken,
                            {expiresIn: '3d'}
                        );

                        const userCred = 
                        {
                            user_id : resultArray[0].user_id,
                            email : email,
                            token : accessToken
                        }

                        mySqlConnection.query('UPDATE users SET ?',{token:accessToken}, (err, results) =>
                        {
                            if(!err)
                            {
                                return res.send(userCred);
                            }
                            else
                            {
                                console.log(err);
                            }
                        });

                    }

                    else
                    {
                        msgToClient={msg: "Incorrect password"};
                        return res.send(msgToClient);
                    }
                })
            }
        });
    },
    
    register: (req,res) => 
    {
        mySqlConnection.query("SELECT* from users WHERE email=?",[req.body.email], async (err,rows)=>
        {   
            if(err)
            {
                console.log(err);
            }

            if(rows.length>0)
            {
                msgToClient={msg: "This email already in use"};
                return res.send(msgToClient);
            }

            let hashedPassword = await bcrypt.hash(req.body.password,10);
            mySqlConnection.query('INSERT INTO users SET ?',{email:req.body.email, password: hashedPassword}, (err, results) =>
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                   configuration.createUserConfiguration(req,res);
                }
            });
        })
    }   
}