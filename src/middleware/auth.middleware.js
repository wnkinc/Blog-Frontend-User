// middleware/auth.middleware.js
const axios = require("axios");

async function verifyToken(req, res, next) {
  try {
    // Log the outgoing request details
    console.log("Outgoing Axios Request:");
    console.log("URL:", `${process.env.BLOG_API_BASE_URL}/auth/verify-token`);
    console.log("Method: GET");
    console.log("Headers:", {
      withCredentials: true, // Include cookies in the request
    });

    // Send a request to your API's verify endpoint
    const response = await axios.get(
      `${process.env.BLOG_API_BASE_URL}/auth/verify-token`,
      {
        headers: {
          Cookie: req.headers.cookie, // Forward the cookies to the backend API
        },
        withCredentials: true, // Include cookies in the request
      }
    );

    // Log the response if successful
    console.log("Request Successful:");
    console.log("Status:", response.status);
    console.log("Data:", response.data);

    // If the response is successful, the token is valid
    next();
  } catch (error) {
    // Log the error details
    console.error("Request Failed:", error.response?.data || error.message);
    return false; // Or handle the error as needed (e.g., redirect to login)
  }
}

module.exports = {
  verifyToken,
};
