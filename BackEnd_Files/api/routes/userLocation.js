const express = require('express');
const router = express.Router();

const {
    getUserLocation,
    insertUserLocation,
    deleteUserLocation
} = require('../controllers/userLocation');

router.get('/:userid', getUserLocation);
router.post('/:userid',insertUserLocation); 
router.delete('/:userid', deleteUserLocation);

module.exports=router;