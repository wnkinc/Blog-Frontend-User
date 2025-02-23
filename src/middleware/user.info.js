const jwt = require("jsonwebtoken");
const axios = require("axios");

async function userInfo(req, res, next) {
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
}

module.exports = {
  userInfo,
};
