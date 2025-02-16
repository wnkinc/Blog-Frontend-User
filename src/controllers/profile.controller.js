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

    // Render the profile view with the fetched user data and posts
    res.render("profile", {
      title: "Profile",
      user: userData,
      posts: userData.posts, // Now each post includes 'author' and 'comments'
    });
  } catch (error) {
    console.error("Error loading profile:", error.message);
    next(error);
  }
}

async function updateBio(req, res, next) {
  try {
    // Extract user ID (sub) from the token attached by verifyToken middleware
    const userSub = req.user.sub;
    const accessToken = req.cookies.access_token;
    const { bio } = req.body; // Get the new bio from the request body

    if (!bio || typeof bio !== "string") {
      return res.status(400).json({ error: "Bio must be a valid string." });
    }

    // Backend API endpoint to update user bio
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/users/${userSub}/bio`;

    // Make the PUT request to update the bio
    const response = await axios.post(
      apiUrl,
      { bio },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Bio Updated Response:", response.data);

    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating bio:", error.message);
    next(error);
  }
}

module.exports = {
  loadProfile,
  updateBio,
};
