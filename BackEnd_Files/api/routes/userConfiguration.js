const express = require("express");
const {verifyToken} = require("../controllers/auth");
const router = express.Router();

const {
    getAllUsersConfiguration,
    getUserConfiguration,
    getUsersConfigurationByRadius, 
    createUserConfiguration,
    deleteUserConfiguration,
    updateUserConfiguration,
    updateSearchMode
} = require('../controllers/userConfiguration');

router.get('/:curr_userid/:userid',getUserConfiguration);
router.get('/:userid',getUserConfiguration); 
router.get('/',getAllUsersConfiguration);
router.get('/location/:user_id/:radius',getUsersConfigurationByRadius);
router.post('/:userid', createUserConfiguration); 
router.delete('/:userid', deleteUserConfiguration);
router.put('/:userid', updateUserConfiguration);
router.put('/searchMode/:userid', updateSearchMode)

module.exports = router;
