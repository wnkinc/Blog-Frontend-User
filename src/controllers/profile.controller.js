// controllers/profile.controller.js

const axios = require("axios");

async function loadProfile(req, res, next) {
  try {
    // Extract user ID (sub) from the token attached by verifyToken middleware
    const userSub = req.user.sub;
    const accessToken = req.cookies.access_token;

    // Backend API endpoint to fetch user information
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/users/${userSub}`;

    // Make the request to the backend API
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Pass token for authentication
      },
    });

    const userData = response.data.user; // Get user data from the response
    console.log("User Data Response:", response.data);

    // Render the profile view with the fetched user data
    res.render("profile", {
      title: "Profile",
      user: userData, // Pass user data to the view
    });
  } catch (error) {
    console.error("Error loading profile:", error.message);

    // Pass the error to the global error handler
    next(error);
  }
}

module.exports = {
  loadProfile,
};
