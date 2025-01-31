// routes/create.routes.js
const express = require("express");
const {
  loadCreate,
  createPost,
  uploadBlob,
} = require("../controllers/create.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const multer = require("multer");

// Define storage (MemoryStorage if you want to forward the buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", verifyToken, loadCreate);
router.post("/", verifyToken, createPost);
router.post("/upload", upload.single("image"), uploadBlob);

module.exports = router;
