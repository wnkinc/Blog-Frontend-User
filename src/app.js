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
const jwt = require("jsonwebtoken");
const axios = require("axios");

app.use(async (req, res, next) => {
  console.log("Middleware Executed");
  try {
    if (req.cookies.access_token && req.cookies.id_token) {
      // Decode the ID token to extract the sub claim
      const decodedIdToken = jwt.decode(req.cookies.id_token);
      const userSub = decodedIdToken && decodedIdToken.sub;

      if (!userSub) {
        throw new Error("User sub not found in ID token");
      }

      const accessToken = req.cookies.access_token;
      // Use the user's sub to fetch their profile
      const apiUrl = `${process.env.BLOG_API_BASE_URL}/users/${userSub}`;

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      res.locals.user = response.data.user; // Ensure your API returns { user: { ... } }
      console.log("User Data Set in Locals:", res.locals.user);
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    console.error("Error fetching user in middleware:", error.message);
    res.locals.user = null;
  }
  next();
});

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Blog-Frontend-User - listening on port ${PORT}!`);
});
