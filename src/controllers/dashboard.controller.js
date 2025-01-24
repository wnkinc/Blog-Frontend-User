// controllers/dashboard.controller.js
const axios = require("axios");

// Function to load the dashboard page
async function loadDashboard(req, res, next) {
  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts`; // Ensure this is in your .env file
    const response = await axios.get(apiUrl, {
      params: {
        page: 1, // First page
        pageSize: 10, // Limit posts to 10
      },
    });

    const { posts, meta } = response.data;

    // Render the homepage with posts and metadata
    res.render("dashboard", {
      title: "Dashboard",
      description: "Welcome to your profile!",
      posts,
      meta,
    });
  } catch (error) {
    console.error("Error fetching posts for homepage:", error);
    next(error); // Forward to error handling middleware
  }
}

module.exports = {
  loadDashboard,
};
