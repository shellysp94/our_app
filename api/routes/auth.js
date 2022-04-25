const express = require('express');
const router = express.Router();

const {
    login,
    register
} = require('../controllers/auth');

router.post('/login',login); //get user by appid (/users/:appid)
router.post('/register', register); //post (/users/)

module.exports=router;