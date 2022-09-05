const dbConfig = require("../../config/db_config");
const mySqlConnection = dbConfig;
const logger = require("../../utils/logger");

const path = require("path");
const fs = require("fs");

function getPicNameAndEncode(imageName) {
  dirnametemp = __dirname.substring(0, __dirname.length - 15);
  //local host
  //finalFilePath = dirnametemp + "images\\" + imageName;
  //ec2
  finalFilePath = dirnametemp + "images//" + imageName;
  //encode image as base 64
  var imageAsBase64 = fs.readFileSync(finalFilePath, "base64");
  return imageAsBase64;
}

module.exports = {
  getPicNameAndEncode,

  getUserPictures: (req, res) => {
    logger.info("This is an info log");
    mySqlConnection.query(
      "SELECT* from User_pictures WHERE user_id=?",
      [req.params.userid],
      (err, rows) => {
        try {
          if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
              rows[i].image = getPicNameAndEncode(rows[i].image);
            }
            return res.send(rows);
          } else {
            //maybe should convert to cb func in user confihturaion
            mySqlConnection.query(
              `SELECT * from user_configuration where user_id = ?`,
              [req.params.userid],
              (err, newRows) => {
                if (!err) {
                  main_image = "1";
                  user_id = req.params.userid;

                  if (newRows[0].gender == "Woman") {
                    user_image = getPicNameAndEncode("woman_profile.jpg");
                  } else if (newRows[0].gender == "Man") {
                    user_image = getPicNameAndEncode("male_profile.jpg");
                  } else {
                    user_image = getPicNameAndEncode("non_binary_profile.PNG");
                  }

                  return res.send([
                    {
                      user_id: user_id,
                      image: user_image,
                      main_image: main_image,
                    },
                  ]);
                } else {
                  console.log(err);
                }
              }
            );
          }
        } catch {
          console.log(err);
        }
      }
    );
  },

  getUserMainPicture: (req, res) => {
    logger.info("This is an info log");
    mySqlConnection.query(
      "SELECT* from User_pictures WHERE user_id=? AND main_image='1'",
      [req.params.userid],
      (err, rows) => {
        try {
          res.send(rows);
        } catch {
          console.log(err);
        }
      }
    );
  },

  deleteUserPicture: (req, res) => {
    logger.info("This is an info log");
    mySqlConnection.query(
      "DELETE FROM User_pictures WHERE user_id=? AND image=?",
      [req.params.userid, req.body.image],
      (err, resuls) => {
        try {
          fileName = req.body.image;
          //fileName = fileName.substring(6);
          dirnametemp = __dirname.substring(0, __dirname.length - 15);
          //finalFilePath = dirnametemp + "images\\" + fileName; //for localhot
          finalFilePath = dirnametemp + "images/" + fileName; //for aws

          fs.unlink(finalFilePath, function (err) {
            if (err) {
              console.log(err);
            } else {
              res.send("picture deleted successfully");
            }
          });
        } catch {
          console.log(err);
        }
      }
    );
  },

  updateUserPicture: (req, res) => {
    logger.info("This is an info log");
    user_id = req.params.userid;
    old_image = req.body.old_image;
    image = req.file.path.substring(7);
    main_image = req.body.main_image;

    mySqlConnection.query(
      "UPDATE User_pictures SET image=?, main_image=? WHERE user_id=? and image=?",
      [image, main_image, user_id, old_image],
      (err, result) => {
        if (!err) {
          dirnametemp = __dirname.substring(0, __dirname.length - 15);
          finalFilePath = dirnametemp + "images\\" + old_image;
          fs.unlink(finalFilePath, function (err) {
            if (err) {
              console.log(err);
            } else {
              res.send("picture updated successfully");
            }
          });
        } else {
          console.log(err);
        }
      }
    );
  },

  uploadBase64Image: async (req, res, next) => {
    try {
      logger.info("This is an info log");
      let user_id = req.params.userid;
      main_image = req.body.main_image;
      mySqlConnection.query(
        `SELECT* FROM User_pictures WHERE user_id=? AND main_image='1'`,
        [user_id],
        (err, rows) => {
          if (!err) {
            if (rows.length > 0 && main_image == "1") {
              return res.send({ msg: "user already has main image" });
            } else {
              const pathName = "./images/" + Date.now() + ".png";
              const imgdata = req.body.base64image;
              const base64Data = imgdata.replace(
                /^data:([A-Za-z-+/]+);base64,/,
                ""
              );
              fs.writeFileSync(pathName, base64Data, { encoding: "base64" });
              mySqlConnection.query(
                `INSERT INTO User_pictures (user_id, image, main_image) VALUES ("${user_id}","${pathName.substring(
                  9
                )}","${main_image}")`,
                (err, result) => {
                  if (!err) {
                    return res.send({
                      msg: "picture of user added successfully",
                      image: pathName.substring(9),
                    });
                  } else {
                    console.log(err);
                  }
                }
              );
            }
          }
        }
      );
    } catch (e) {
      next(e);
    }
  },
};
