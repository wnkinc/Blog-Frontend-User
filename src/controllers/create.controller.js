// controllers/create.controller.js
const axios = require("axios");
require("dotenv").config();

// Function to load the create post page
async function loadCreate(req, res, next) {
  res.render("create", {
    pageTitle: "Create Post",
    tinyMCEApiKey: process.env.TINYMCE_API_KEY,
  });
}

// Function to handle post creation (Publish or Save Draft)
async function createPost(req, res, next) {
  try {
    const { title, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // Send post data to backend API
    const response = await axios.post(`${process.env.BACKEND_API_URL}/posts`, {
      title,
      content,
      status, // 'published' or 'draft'
      userId: req.user.id,
    });

    if (status === "published") {
      res.redirect(`/post/${response.data.id}`); // Redirect to the published post
    } else {
      res.redirect("/dashboard"); // Redirect to drafts list
    }
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  loadCreate,
  createPost,
};
