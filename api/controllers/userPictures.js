const dbConfig = require('../../config/db_config');
const mySqlConnection = dbConfig;

const path = require("path");
const fs = require("fs");

function getPicNameAndEncode(imageName) {
	dirnametemp = __dirname.substring(0, __dirname.length - 15);
	finalFilePath = dirnametemp + "images\\" + imageName;
	//encode image as base 64
	var imageAsBase64 = fs.readFileSync(finalFilePath, "base64");

	return imageAsBase64;
}

module.exports={
    getPicNameAndEncode,

       getUserPictures: (req,res) => {
        mySqlConnection.query("SELECT* from user_pictures WHERE user_id=?",[req.params.userid], (err,rows)=>{
            if(!err)
            {
                if(rows.length > 0)
                {
                    for(var i =0; i<rows.length; i++)
                    {
                        rows[i].image = getPicNameAndEncode(rows[i].image);
                    }
                    return res.send(rows);
                }
                else
                {
                    //maybe should convert to cb func in user confihturaion
                    mySqlConnection.query(`SELECT * from user_configuration where user_id = ?`, [req.params.userid], (err, newRows)=>
                    {
                        if(!err)
                        {
                            main_image = '1';
                            user_id = req.params.userid;
    
                            if(newRows[0].gender == "Woman")
                            {
                                user_image = getPicNameAndEncode("woman_profile.jpg");
                            }
                            else if(newRows[0].gender == "Man")
                            {
                                user_image = getPicNameAndEncode("male_profile.jpg");
                            }

                            else
                            {
                                user_image = getPicNameAndEncode("non_binary_profile.PNG");
                            }
                            
                            return res.send( 
                            [{
                                user_id : user_id,
                                image : user_image,
                                main_image : main_image
                            }])
                            
                        }
                        else
                        {
                            console.log(err);
                        }
                    })
                }
            }
            else
            {
                console.log(err);
            }
        })
    },

    getUserMainPicture: (req, res) =>
    {
        mySqlConnection.query("SELECT* from user_pictures WHERE user_id=? AND main_image='1'", [req.params.userid], (err,rows) =>
        {
            if(!err)
            {
                res.send(rows);
            }
            else
            {
                console.log(err);
            }
        })
    },
    
    deleteUserPicture: (req,res) => {
        mySqlConnection.query("DELETE FROM user_pictures WHERE user_id=? AND image=?",[req.params.userid,req.body.image], (err,resuls)=>{
            if(!err)
            {
                fileName = req.body.image;
                fileName = fileName.substring(6);
                dirnametemp = __dirname.substring(0,__dirname.length-15);
                finalFilePath=dirnametemp+'images\\'+fileName;
                
                fs.unlink(finalFilePath, function(err) 
                { 
                    if (err) 
                    { 
                       console.log(err);
                    } 
                    else 
                    { 
                        res.send("picture deleted successfully");
                    } 
                })
            }
            else
            {
                console.log(err);
            }
        })
    },

    updateUserPicture: (req,res)=> {
        user_id= req.params.userid;
        old_image = req.body.old_image;
        image = req.file.path.substring(7);
        main_image = req.body.main_image;

        mySqlConnection.query("UPDATE user_pictures SET image=?, main_image=? WHERE user_id=? and image=?", [image,main_image,user_id,old_image], (err,result)=> {
            if (!err)
            {
                dirnametemp = __dirname.substring(0,__dirname.length-15);
                finalFilePath=dirnametemp+'images\\'+old_image;
                fs.unlink(finalFilePath, function(err) 
                { 
                    if (err) 
                    { 
                       console.log(err);
                    } 
                    else 
                    { 
                        res.send("picture updated successfully");
                    } 
                })
            }
            else
            {
                console.log(err)
            }
        })
    },

    uploadBase64Image: async(req,res,next) =>
    {
        try
        {
            let user_id= req.params.userid;
            main_image = req.body.main_image;
            mySqlConnection.query(`SELECT* FROM user_pictures WHERE user_id=? AND main_image='1'`, [user_id], (err,rows) =>
            {
                if(!err)
                {
                    if(rows.length>0 && main_image == '1')
                    {
                        return res.send({msg: "user already has main image"});
                    }  

                    else
                    {
                        const pathName = "./images/"+Date.now()+'.png'
                        const imgdata = req.body.base64image;
                        const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/,'');
                        fs.writeFileSync(pathName, base64Data, {encoding: 'base64'});
                        mySqlConnection.query(`INSERT INTO user_pictures (user_id, image, main_image) VALUES ("${user_id}","${pathName.substring(9)}","${main_image}")`,(err,result)=> 
                        {
                            if(!err)
                            {
                                return res.send({"msg":"picture of user added successfully","image":pathName.substring(9)});
                            }
                            else
                            {
                                console.log(err);
                            }
                        });
                }
            }
        });
        }
        
        catch(e)
        {
            next(e);
        }
    }
}