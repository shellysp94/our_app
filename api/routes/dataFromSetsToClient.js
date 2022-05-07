const express = require("express");
const router = express.Router();
const {getAllConstants} = require("../controllers/dataFromSetsToClient");

router.get("/", getAllConstants);

module.exports = router;
