// routes/create.routes.js
const express = require("express");
const { loadCreate, createPost } = require("../controllers/create.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", loadCreate);
router.post("/", createPost);

module.exports = router;
