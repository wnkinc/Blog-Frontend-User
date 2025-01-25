// routes/profile.routes.js
const express = require("express");
const { loadProfile } = require("../controllers/profile.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, loadProfile);

module.exports = router;
