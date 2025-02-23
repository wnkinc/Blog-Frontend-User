// app.js frontend user
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
app.get("/", (req, res) => {
  res.status(200).send("User frontend is up and running!");
});

const dashboardRouter = require("./routes/dashboard.routes");
const profileRouter = require("./routes/profile.routes");
const createRouter = require("./routes/create.routes");
const postRoutes = require("./routes/post.routes");

app.use("/create", createRouter);
app.use("/dashboard", dashboardRouter);
app.use("/profile", profileRouter);
app.use("/post", postRoutes);

app.get("*", (req, res) => {
  res.render("partials/404", { title: "Page Not Found" });
});

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Blog-Frontend-User - listening on port ${PORT}!`);
});
