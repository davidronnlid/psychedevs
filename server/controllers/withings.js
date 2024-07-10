const express = require("express");
const axios = require("axios");
const router = express.Router();
const WithingsUser = require("../models/withingsUser");

// Withings callback route
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post(
      "https://wbsapi.withings.net/v2/oauth2",
      null,
      {
        params: {
          action: "requesttoken",
          grant_type: "authorization_code",
          client_id: process.env.WITHINGS_CLIENT_ID,
          client_secret: process.env.WITHINGS_SECRET,
          code: code,
          redirect_uri: process.env.WITHINGS_REDIRECT_URI,
        },
      }
    );

    console.log("Access token response received:", response.data);

    const { access_token, refresh_token, userid } = response.data.body;

    // Find or create the user in the database
    let user = await WithingsUser.findOne({ withingsId: userid });
    if (user) {
      console.log("User found, updating access and refresh tokens");
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      await user.save();
      console.log("User updated successfully");
    } else {
      console.log("User not found, creating new user");
      user = new WithingsUser({
        withingsId: userid,
        accessToken: access_token,
        refreshToken: refresh_token,
      });
      await user.save();
      console.log("New user created successfully");
    }
    console.log("A Withings user has been authenticated!", user);
    res.redirect(`${process.env.WITHINGS_LOCAL_REDIRECT_URI}?status=success`);
  } catch (error) {
    console.error("Error during Withings authentication", error);
    res.status(500).send("Authentication failed");
  }
});

// Endpoint to check if a Withings user is already authenticated
router.get("/check_withings_auth", async (req, res) => {
  console.log("Received request to check Withings authentication");

  try {
    console.log("Attempting to find a Withings user in the database...");
    const user = await WithingsUser.findOne();

    if (user) {
      console.log("Withings user found:", user.withingsId);
      return res.json({ isAuthorized: true, withingsId: user.withingsId });
    } else {
      console.log("No Withings user found in the database.");
      return res.json({ isAuthorized: false });
    }
  } catch (error) {
    console.error("Error checking Withings authentication", error);
    return res.status(500).json({ isAuthorized: false });
  }
});

module.exports = router;
