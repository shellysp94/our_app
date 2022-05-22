const express = require('express');
const router = express.Router();

const {
    getUserFriendRequests,
    sendFriendRequest, 
    approveFriendRequest,
} = require('../controllers/friendRequest');

router.get('/:userid',getUserFriendRequests); //get user friend requests
router.post('/send/:useridA/:useridB',sendFriendRequest); 
router.post('/approve/:useridA/:useridB', approveFriendRequest); 

module.exports=router;