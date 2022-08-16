const express = require('express');
const router = express.Router();

const {
    getAllUsers, 
    getOneUser,
    deleteUser,
    updateUser,
    getUsersByRadius
} = require('../controllers/users');



router.get('/',getAllUsers); //get all users (/users/)
router.get('/:userid',getOneUser); //get user by userid (/users/:appid)
router.delete('/:userid', deleteUser) //delete user (/users/:appid)
router.put('/:userid', updateUser)

router.get('/locations/:radius',getUsersByRadius);

module.exports=router;