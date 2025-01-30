// controllers/dashboard.controller.js
const axios = require("axios");
require("dotenv").config();

// Function to load the dashboard page
async function loadCreate(req, res, next) {
  res.render("create", {
    pageTitle: "Create Post",
    tinyMCEApiKey: process.env.TINYMCE_API_KEY,
  });
}

module.exports = {
  loadCreate,
};
