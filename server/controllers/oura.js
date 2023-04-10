const express = require("express");
const router = express.Router();
const OURA_AUTH_URL = "https://cloud.ouraring.com/oauth/authorize";
const OuraUser = require("../models/ouraUser");

const axios = require("axios");
const OURA_TOKEN_URL = "https://api.ouraring.com/oauth/token";

module.exports = () => {
  router.get("/auth", (req, res) => {
    console.log("GET req received at /oura/auth");

    const queryParams = new URLSearchParams({
      client_id: process.env.OURA_CLIENT_ID,
      redirect_uri:
        process.env.NODE_ENV === "development"
          ? process.env.OURA_REDIRECT_URI_LOCAL
          : process.env.OURA_REDIRECT_URI,
      response_type: "code",
      scope: "heartrate",
    });

    res.redirect(`${OURA_AUTH_URL}?${queryParams}`);
  });

  router.get("/auth/callback", async (req, res) => {
    console.log("GET req received at /oura/auth/callback");

    const { code } = req.query;
    try {
      const response = await axios.post(OURA_TOKEN_URL, {
        client_id: process.env.OURA_CLIENT_ID,
        client_secret: process.env.OURA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.OURA_REDIRECT_URI,
      });

      const { access_token, refresh_token, user_id } = response.data;

      // Save the access_token and refresh_token for the user in your database.
      const existingOuraUser = await OuraUser.findOne({ ouraId: user_id });

      if (existingOuraUser) {
        existingOuraUser.accessToken = access_token;
        existingOuraUser.refreshToken = refresh_token;
        await existingOuraUser.save();
      } else {
        const newOuraUser = new OuraUser({
          ouraId: user_id,
          accessToken: access_token,
          refreshToken: refresh_token,
        });
        await newOuraUser.save();
      }

      console.log("No error when integrating with oura.");
      res.redirect("/some-frontend-route");
    } catch (error) {
      // Handle error
      console.error("Error fetching access token:", error);
      res.status(500).send("Error fetching access token");
    }
  });

  const OURA_HRV_URL = "https://api.ouraring.com/v1/hrv";

  router.get("/hrv", async (req, res) => {
    console.log("Received GET req at /oura/hrv");

    const { access_token } = req.user; // Get the access_token from your database.

    try {
      const response = await axios.get(OURA_HRV_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
        params: { start: "yyyy-mm-dd", end: "yyyy-mm-dd" }, // Specify the desired date range.
      });

      res.json(response.data);
    } catch (error) {
      console.error("Error fetching HRV data:", error);
      res.status(500).send("Error fetching HRV data");
    }
  });

  return router;
};
