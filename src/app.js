// app.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

/**
 * -------------- ROUTES ----------------
 */
const dashboardRouter = require("./routes/dashboard.routes");
const profileRouter = require("./routes/profile.routes");
const createRouter = require("./routes/create.routes");
const postRoutes = require("./routes/post.routes");

app.use("/create", createRouter);
app.use("/dashboard", dashboardRouter);
app.use("/profile", profileRouter);
app.use("/post", postRoutes);

/**
 * -------------- Error handling ----------------
 */
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).render("partials/error", {
    title: "Server Error",
    error: err,
  });
});

// 404 Handler - Placed AFTER all routes & middleware
app.use((req, res) => {
  res.status(404).render("partials/404", {
    title: "Page Not Found",
  });
});

/**
 * -------------- Server ----------------
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Blog-Frontend-User - listening on port ${PORT}!`);
});
