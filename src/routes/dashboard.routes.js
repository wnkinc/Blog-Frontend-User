// routes/dashboard.routes.js
const express = require("express");
const {
  loadDashboard,
  getUnderConstructionPage,
} = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { userInfo } = require("../middleware/user.info");

const router = express.Router();

router.get("/", userInfo, verifyToken, loadDashboard);
router.get("/underConstruction", getUnderConstructionPage);

module.exports = router;
