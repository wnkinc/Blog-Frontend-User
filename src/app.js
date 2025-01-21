require("dotenv").config();
const path = require("path");
const express = require("express");

const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files like CSS, JS, and images

/**
 * -------------- ROUTES ----------------
 */
// const indexRouter = require("./routes/indexRouter");
// const authRouter = require("./routes/authRouter");
// const profileRouter = require("./routes/profileRouter");

// app.use("/", indexRouter); // Home and general routes
// app.use("/auth", authRouter); // Login, signup, logout routes
// app.use("/profile", profileRouter); // User profile routes

/**
 * -------------- Error handling ----------------
 */
// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { title: "Server Error", error: err });
});

/**
 * -------------- Server ----------------
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend user side is running at http://localhost:${PORT}`);
});
