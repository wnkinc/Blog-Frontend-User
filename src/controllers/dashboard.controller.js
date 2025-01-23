// controllers/dashboard.controller.js

// Function to load the dashboard page
async function loadDashboard(req, res) {
  try {
    // Render the dashboard view
    res.render("dashboard");
  } catch (error) {
    console.error("Error loading dashboard:", error.message);
    res.status(500).send("An error occurred while loading the dashboard.");
  }
}

module.exports = {
  loadDashboard,
};
