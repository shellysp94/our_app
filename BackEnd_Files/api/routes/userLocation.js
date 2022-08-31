const express = require('express');
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {
    getUserLocation,
    insertUserLocation,
    deleteUserLocation
} = require('../controllers/userLocation');

router.get('/:userid',verifyToken, getUserLocation);
router.post('/:userid',verifyToken,insertUserLocation); 
router.delete('/:userid',verifyToken, deleteUserLocation);

module.exports=router;