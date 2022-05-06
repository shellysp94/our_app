const express = require("express");
const router = express.Router();
const {returnAllFiltersInSet} = require("../controllers/dataFromSetsToClient");

router.get("/", returnAllFiltersInSet);

module.exports = router;
