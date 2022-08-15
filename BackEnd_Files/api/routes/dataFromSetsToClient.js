const express = require("express");
const router = express.Router();
const {
	getAllConstants,
	getUsersAccordingToChosenExperiences,
} = require("../controllers/dataFromSetsToClient");

router.get("/", getAllConstants);
router.get("/experience/:userid", getUsersAccordingToChosenExperiences);

module.exports = router;
