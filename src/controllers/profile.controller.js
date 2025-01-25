// controllers/profile.controller.js

function loadProfile(req, res) {
  res.render("profile", {
    title: "Profile", // Pass the title variable
    // Pass any other required variables
  });
}

module.exports = {
  loadProfile,
};
