// controllers/dashboard.controller.js
const axios = require("axios");

// Function to load the dashboard page
async function loadDashboard(req, res, next) {
  try {
    const apiUrl = `${process.env.BLOG_API_BASE_URL}/posts`;
    const response = await axios.get(apiUrl);

    // Extract posts from API response
    let { posts } = response.data;

    // Add a total reactions count per post
    posts = posts.map((post) => {
      const reactionsCount = post.reactions.reduce(
        (sum, reaction) => sum + reaction.count,
        0
      );
      return { ...post, reactionsCount };
    });

    // Render the homepage with updated posts data
    res.render("layout", {
      pageTitle: "Homepage",
      description: "Welcome to the Blog User!",
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts for homepage:", error);
    next(error);
  }
}

/**
 * -------------- GET posts ----------------
 */
const getUnderConstructionPage = async (req, res, next) => {
  res.render("underConstruction");
};

module.exports = {
  loadDashboard,
  getUnderConstructionPage,
};
