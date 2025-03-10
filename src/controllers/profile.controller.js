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

    // Add a total reactions count per post in the profile data
    if (userData.posts && Array.isArray(userData.posts)) {
      userData.posts = userData.posts.map((post) => {
        // Default to an empty array if post.reactions is undefined
        const reactionsCount = (post.reactions || []).reduce(
          (sum, reaction) => sum + reaction.count,
          0
        );
        return { ...post, reactionsCount };
      });
    }

    // Render the profile view with the fetched user data and posts
    res.render("profile", {
      title: "Profile",
      user: userData,
      posts: userData.posts, // Each post now includes the 'reactionsCount'
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

async function updateProfilePic(req, res, next) {
  try {
    // Extract user ID (sub) from the token attached by verifyToken middleware
    const userSub = req.user.sub;
    const accessToken = req.cookies.access_token;
    const { profilePicUrl } = req.body; // Get the profile picture URL from the request body

    if (!profilePicUrl || typeof profilePicUrl !== "string") {
      return res.status(400).json({ error: "Invalid profile picture URL." });
    }

    // Backend API endpoint to update the profile picture
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/users/${userSub}/pic`;

    // Make the POST request to update the profile picture
    const response = await axios.post(
      apiUrl,
      { profilePicUrl },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Profile Picture Updated Response:", response.data);

    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    next(error);
  }
}

module.exports = {
  loadProfile,
  updateBio,
  updateProfilePic,
};
