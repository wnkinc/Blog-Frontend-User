// routes/auth.router.js
const express = require("express");
const { handleCallback } = require("../controllers/auth.controller");

const router = express.Router();

// Route: Handle Cognito callback
router.get("/callback", handleCallback);

module.exports = router;
