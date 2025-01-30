// routes/dashboard.routes.js
const express = require("express");
const { loadDashboard } = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, loadDashboard);

module.exports = router;
