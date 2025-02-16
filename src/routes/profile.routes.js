// routes/profile.routes.js
const express = require("express");
const {
  loadProfile,
  updateBio,
  updateProfilePic,
} = require("../controllers/profile.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, loadProfile);
router.post("/bio", verifyToken, updateBio);
router.post("/pic", verifyToken, updateProfilePic);

module.exports = router;
