// routes/create.routes.js
const express = require("express");
const { loadCreate, createPost } = require("../controllers/create.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, loadCreate);
router.post("/", verifyToken, createPost);

module.exports = router;
