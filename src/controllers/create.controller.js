// controllers/dashboard.controller.js
const axios = require("axios");

// Function to load the dashboard page
async function loadCreate(req, res, next) {
  res.render("create", {
    pageTitle: "Create Post",
  });
}

module.exports = {
  loadCreate,
};
