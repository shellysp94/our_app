const express = require('express');
const router = express.Router();

const {
    getUserLocation,
    insertUserLocation,
    updateUserLocation,
    deleteUserLocation
} = require('../controllers/userLocation');

router.get('/:userid', getUserLocation);
router.post('/:userid',insertUserLocation); 
router.post('/update_location/:userid', updateUserLocation);
router.delete('/:userid', deleteUserLocation);

module.exports=router;