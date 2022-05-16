const express = require('express');
const {verifyToken} = require('../controllers/auth');
const router = express.Router();

const {
    getAllUsersConfiguration,
    getUserConfiguration, 
    createUserConfiguration,
    deleteUserConfiguration,
    updateUserConfiguration,
    updateSearchMode
} = require('../controllers/userConfiguration');

router.get('/:userid',verifyToken,getUserConfiguration); //get user persaonal details by appid (/PersonalDetails/:appid)
router.get('/',getAllUsersConfiguration);
router.post('/:userid', createUserConfiguration); //post (/PersonalDetails/)
router.delete('/:userid', deleteUserConfiguration); //delete user persaonal details (/PersonalDetails/:appid)
router.put('/:userid', updateUserConfiguration);
router.put('/searchMode/:userid', updateSearchMode)

module.exports=router;