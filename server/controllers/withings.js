const express = require("express");
const router = express.Router();
const axios = require("axios"); // Ensure axios is installed for HTTP requests

// Redirect to Withings authorization page
router.get("/auth", (req, res) => {
  const clientId = process.env.WITHINGS_CLIENT_ID;
  const redirectUri = process.env.WITHINGS_REDIRECT_URI; // Ensure this is correctly set in your environment variables
  const scope = "user.activity"; // Define required scopes
  const authUrl = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=randomstate`;

  res.redirect(authUrl);
});

// Handle callback with authorization code
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (code) {
    try {
      const accessToken = await requestAccessToken(code);
      // Here you might want to do something with the accessToken, like storing it or setting a session
      res.redirect("/"); // Redirect to your application's main page or dashboard
    } catch (error) {
      console.error("Error obtaining access token:", error);
      res.status(500).send("Authentication error");
    }
  } else {
    res.status(400).send("No authorization code provided");
  }
});

async function requestAccessToken(authorizationCode) {
  // This function needs to be implemented to exchange the authorization code for an access token
  const clientId = process.env.WITHINGS_CLIENT_ID;
  const clientSecret = process.env.WITHINGS_CLIENT_SECRET;
  const redirectUri = process.env.WITHINGS_REDIRECT_URI;

  const tokenUrl = `https://account.withings.com/oauth2/token`;
  try {
    const response = await axios.post(tokenUrl, {
      code: authorizationCode,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error(
      "Error exchanging authorization code for access token:",
      error
    );
    throw error; // Rethrow the error to handle it in the calling function
  }
}

module.exports = router;
