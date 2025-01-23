// controller/auth.controller.js
const axios = require("axios");
const qs = require("querystring");

async function handleCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing." });
    }

    const payload = {
      grant_type: "authorization_code",
      client_id: process.env.COGNITO_CLIENT_ID,
      redirect_uri: process.env.COGNITO_REDIRECT_URI,
      code,
    };

    console.log("Request payload:", payload);

    const response = await axios.post(
      process.env.COGNITO_TOKEN_ENDPOINT,
      qs.stringify(payload),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { id_token, access_token, refresh_token } = response.data;
    console.log(id_token, access_token, refresh_token);

    // Handle tokens (e.g., set cookies, store in session)
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

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(
      "Error during callback handling:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Authentication callback failed." });
  }
}

module.exports = { handleCallback };
