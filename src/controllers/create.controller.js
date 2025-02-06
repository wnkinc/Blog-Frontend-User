// controllers/create.controller.js
const axios = require("axios");
require("dotenv").config();
const FormData = require("form-data");

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
    const { title, content, status, coverImage } = req.body;
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
        coverImage,
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

// Function to handle TinyMCE image upload
async function uploadBlob(req, res) {
  try {
    console.log("🔥 HIT: Received image upload request at Frontend Server");

    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized: No access token." });
    }

    console.log("🟢 Access Token:", accessToken);

    // ✅ Ensure the request contains an actual file
    if (!req.file) {
      console.error("❌ No file received from TinyMCE");
      return res.status(400).json({ error: "No file uploaded." });
    }

    // ✅ Create FormData and append file
    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: req.file.originalname,
    });

    console.log(
      "📤 Forwarding FormData to Backend API:",
      "http://localhost:8080/posts/upload"
    );

    // ✅ DO NOT manually set Content-Type, let Axios handle it
    const response = await axios.post(
      "http://localhost:8080/posts/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...formData.getHeaders(), // ✅ Ensures boundary is set correctly
        },
      }
    );

    console.log("✅ Backend Response:", response.data);
    res.json({ url: response.data.imageUrl });
  } catch (error) {
    console.error("❌ Error uploading image:", error.message);
    console.error(
      "🔴 Error Response:",
      error.response ? error.response.data : "No response received"
    );
    res.status(500).json({ error: "Image upload failed." });
  }
}

module.exports = {
  loadCreate,
  createPost,
  uploadBlob,
};
