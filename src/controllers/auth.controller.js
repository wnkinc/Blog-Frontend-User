// controllers/auth.controller.js
const axios = require("axios");
const qs = require("querystring");
const jwt = require("jsonwebtoken");

/**
 * -------------- Cognito Callback ----------------
 */
async function handleCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing." });
    }

    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Decode ID token to extract user information
    const decodedToken = jwt.decode(tokens.id_token);

    // Map the fields appropriately
    const userInfo = {
      sub: decodedToken.sub,
      email: decodedToken.email,
      username: decodedToken["cognito:username"], // Map 'cognito:username' to 'username'
    };

    // Log the decoded and mapped user information
    console.log("Mapped User Info for API:", userInfo);

    // Call the API to Check/Create a user
    const response = await axios.post("http://localhost:8080/users", userInfo, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`, // Pass access token for authentication if needed
      },
    });

    console.log("API Response:", response.data);

    // Set authentication cookies
    setAuthCookies(res, tokens);

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(
      "Error during callback handling:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Authentication callback failed." });
  }
}

function setAuthCookies(res, tokens) {
  const { id_token, access_token, refresh_token } = tokens;

  res.cookie("id_token", id_token, {
    httpOnly: true,
    secure: process.env.APP_ENV === "production",
    sameSite: "Lax",
  });
  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: process.env.APP_ENV === "production",
    sameSite: "Lax",
  });
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.APP_ENV === "production",
    sameSite: "Lax",
  });
}

async function exchangeCodeForTokens(code) {
  const payload = {
    grant_type: "authorization_code",
    client_id: process.env.COGNITO_CLIENT_ID,
    redirect_uri: process.env.COGNITO_REDIRECT_URI,
    code,
  };

  const response = await axios.post(
    process.env.COGNITO_TOKEN_ENDPOINT,
    qs.stringify(payload),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  console.log("Token exchange response:", response.data);

  return response.data;
}

module.exports = { handleCallback };
