require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files like CSS, JS, and images

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");

app.use("/", indexRouter); // Home and general routes
app.use("/auth", authRouter); // Login, signup, logout routes
app.use("/profile", profileRouter); // User profile routes

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).render("pages/error", { title: "404 Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .render("pages/error", { title: "Server Error", error: err.message });
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend user side is running at http://localhost:${PORT}`);
});
