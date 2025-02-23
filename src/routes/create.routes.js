// routes/create.routes.js
const express = require("express");
const { loadCreate, createPost } = require("../controllers/create.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", verifyToken, loadCreate);
router.post("/", verifyToken, createPost);

router.post("/upload", upload.single("image"), (req, res) => {
  console.log("File upload initiated...");
  if (req.file && req.file.location) {
    console.log(`File uploaded successfully to ${req.file.location}`);
    res.json({ url: req.file.location });
  } else {
    console.error("File upload failed");
    res.status(500).json({ error: "Image upload failed" });
  }
});

module.exports = router;
