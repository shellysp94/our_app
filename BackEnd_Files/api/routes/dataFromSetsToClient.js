const express = require("express");
const router = express.Router();
const {verifyToken} = require("../controllers/auth");

const {
	getAllConstants,
	getUsersAccordingToChosenExperiences,
} = require("../controllers/dataFromSetsToClient");

router.get("/", getAllConstants);
router.get("/experience/:userid",verifyToken, getUsersAccordingToChosenExperiences);

module.exports = router;
