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

// cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

/**
 * -------------- ROUTES ----------------
 */
const dashboardRouter = require("./routes/dashboard.routes");
const profileRouter = require("./routes/profile.routes");
const createRouter = require("./routes/create.routes");

app.use("/create", createRouter);
app.use("/dashboard", dashboardRouter);
app.use("/profile", profileRouter);

/**
 * -------------- Error handling ----------------
 */
app.use((err, req, res, next) => {
  if (err) {
    // Log the error stack
    console.error("Error:", err.stack);

    // Handle 500 (Server Error)
    res.status(500).render("partials/error", {
      title: "Server Error",
      error: err,
    });
  } else {
    // Handle 404 (Page Not Found)
    res.status(404).render("partials/404", {
      title: "Page Not Found",
    });
  }
});

/**
 * -------------- Server ----------------
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Blog-Frontend-User - listening on port ${PORT}!`);
});
