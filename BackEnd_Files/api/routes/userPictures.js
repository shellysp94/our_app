const express = require('express');
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {
    getUserPictures, 
    deleteUserPicture,
    //updateUserPicture,
    getUserMainPicture,
    uploadBase64Image
} = require('../controllers/userPictures');

router.get('/:userid',verifyToken,getUserPictures); //get user by appid (/hobbies/:userid)
router.get('/main/:userid',verifyToken, getUserMainPicture);
router.post('/:userid',verifyToken, uploadBase64Image);
router.delete('/:userid',verifyToken, deleteUserPicture) //delete user specific picture
//router.put('/:userid',upload, updateUserPicture); //update user

module.exports=router;