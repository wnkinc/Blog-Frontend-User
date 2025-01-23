// routes/dashboard.routes.js
const express = require("express");
const { loadDashboard } = require("../controllers/dashboard.controller");

const router = express.Router();

// Route: Load dashboard
router.get("/", loadDashboard);

module.exports = router;
