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
    const sub = req.user.sub;
    const accessToken = req.cookies.access_token; // Get token from cookies

    if (!title || !content || !sub) {
      return res
        .status(400)
        .json({ error: "Title, content, and sub are required." });
    }

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No access token provided." });
    }

    // Backend API URL
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts`;

    // Send post data to backend API with authentication token
    const response = await axios.post(
      apiUrl,
      {
        title,
        content,
        status,
        sub,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send access token in headers
        },
      }
    );

    // Redirect to post or dashboard based on status
    if (status === "published") {
      res.redirect(`/post/${response.data.slug}`); // Redirect to published post
    } else {
      res.redirect("/dashboard"); // Redirect to drafts list
    }
  } catch (error) {
    console.error("Error creating post:", error.message);
    next(error); // Pass error to Express error handler
  }
}

module.exports = {
  loadCreate,
  createPost,
};
