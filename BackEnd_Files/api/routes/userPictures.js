const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/auth");

const {
  getUserPictures,
  deleteUserPicture,
  getUserMainPicture,
  uploadBase64Image,
} = require("../controllers/userPictures");

router.get("/:userid", getUserPictures);
router.get("/main/:userid", verifyToken, getUserMainPicture);
router.post("/:userid", uploadBase64Image);
router.delete("/:userid", verifyToken, deleteUserPicture); //delete user specific picture

module.exports = router;
