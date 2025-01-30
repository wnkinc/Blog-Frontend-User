// routes/dashboard.routes.js
const express = require("express");
const { loadCreate } = require("../controllers/create.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", loadCreate);

module.exports = router;
