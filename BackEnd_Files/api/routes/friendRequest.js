const express = require('express');
const router = express.Router();

const {
    getUserFriendRequestsSent,
    getUserFriendRequestsRecieved,
    sendFriendRequest, 
    approveFriendRequest,
} = require('../controllers/friendRequest');

router.get('/sendRequests/:userid',getUserFriendRequestsSent); //get user friend requests
router.get('/recievedRequests/:userid',getUserFriendRequestsRecieved); //get user friend requests
router.post('/send/:useridA/:useridB',sendFriendRequest); 
router.post('/approve/:useridA/:useridB', approveFriendRequest); 

module.exports=router;