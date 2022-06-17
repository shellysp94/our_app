const express = require('express');
const router = express.Router();

const {
    getUserPictures, 
    deleteUserPicture,
    //updateUserPicture,
    getUserMainPicture,
    uploadBase64Image
} = require('../controllers/userPictures');

router.get('/:userid',getUserPictures); //get user by appid (/hobbies/:userid)
router.get('/main/:userid', getUserMainPicture);
router.post('/:userid', uploadBase64Image);
router.delete('/:userid', deleteUserPicture) //delete user specific picture
//router.put('/:userid',upload, updateUserPicture); //update user

module.exports=router;