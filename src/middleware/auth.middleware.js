const axios = require("axios");

async function verifyToken(req, res, next) {
  try {
    // Log the outgoing request details
    console.log("Outgoing Axios Request:");
    console.log("URL:", `${process.env.BLOG_API_BASE_URL}/auth/verify-token`);
    console.log("Method: GET");
    console.log("Incoming Request to verifyToken - Headers:", req.headers);
    console.log(
      "Incoming Request to verifyToken - Cookies:",
      req.headers.cookies
    );
    // Send a request to your API's verify endpoint
    const response = await axios.get(
      `${process.env.BLOG_API_BASE_URL}/auth/verify-token`,
      {
        headers: {
          Cookie: req.headers.cookie, // Forward cookies from the browser
        },
        withCredentials: true, // Include cookies in the request
      }
    );

    // Log the successful response
    console.log("Token verification successful:");
    console.log("Response Data:", response.data);

    // Attach the user information to req.user
    req.user = response.data.user; // Assuming backend returns { success: true, user: {...} }
    req.user.access_token = req.cookies.access_token;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error details
    console.error(
      "Token verification failed:",
      error.response?.data || error.message
    );

    // Send an unauthorized response
    res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
  }
}

module.exports = {
  verifyToken,
};
