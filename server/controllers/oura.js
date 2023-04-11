const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const router = express.Router();
const OURA_AUTH_URL = "https://cloud.ouraring.com/oauth/authorize";
const OuraUser = require("../models/ouraUser");

const axios = require("axios");
const OURA_TOKEN_URL = "https://api.ouraring.com/oauth/token";

module.exports = () => {
  router.get("/auth", (req, res) => {
    console.log("GET req received at /oura/auth");

    const token = req.headers.authorization.split(" ")[1];

    const queryParams = new URLSearchParams({
      client_id: process.env.OURA_CLIENT_ID,
      redirect_uri:
        process.env.NODE_ENV === "development"
          ? process.env.OURA_REDIRECT_URI_LOCAL
          : process.env.OURA_REDIRECT_URI,
      response_type: "code",
      scope: "heartrate daily workout tag session",
      state: token.toString(),
    });

    console.log("About to redirect user to", `${OURA_AUTH_URL}?${queryParams}`);

    const redirectUrl = `${OURA_AUTH_URL}?${queryParams}`;

    res.json({ redirectUrl });
  });

  router.get("/auth/completed", async (req, res) => {
    console.log("GET req received at /oura/auth/completed");

    const { code, state } = req.query;

    const decodedToken = jwt.verify(state, process.env.JWT_SECRET);
    const PD_user_id = new ObjectId(decodedToken.userId);

    try {
      const response = await axios.post(
        OURA_TOKEN_URL,
        {
          code,
          grant_type: "authorization_code",
          redirect_uri:
            process.env.NODE_ENV === "development"
              ? process.env.OURA_REDIRECT_URI_LOCAL
              : process.env.OURA_REDIRECT_URI,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.OURA_CLIENT_ID}:${process.env.OURA_CLIENT_SECRET}`
            ).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Axios respone is this: ", response.data);

      const { access_token, refresh_token } = response.data;

      // Save the access_token and refresh_token for the user in your database.
      const existingOuraUser = await OuraUser.findOne({
        PD_user_id: PD_user_id,
      });

      if (existingOuraUser) {
        existingOuraUser.accessToken = access_token;
        existingOuraUser.refreshToken = refresh_token;
        await existingOuraUser.save();
      } else {
        const newOuraUser = new OuraUser({
          PD_user_id: new ObjectId(PD_user_id),
          accessToken: access_token,
          refreshToken: refresh_token,
        });
        await newOuraUser.save();
      }

      console.log("No error when integrating with oura.");
      const clientBaseUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://psychedevs.com";
      const redirectTo = `${clientBaseUrl}/logs/planner`;
      res.redirect(redirectTo);
    } catch (error) {
      // Handle error
      // console.error("Error fetching access token:", error);
      res.status(500).send("Error fetching access token");
    }
  });

  async function fetchDataFromEndpoint(accessToken, dataType, start, end) {
    try {
      const url = `https://api.ouraring.com/v2/usercollection/${dataType}?start_date=${start}&end_date=${end}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}.`);
      throw error;
    }
  }
  router.get("/data", async (req, res) => {
    console.log("Received GET req at /oura/data");
    const token = req.headers.authorization.split(" ")[1];

    const test_call =
      "https://api.ouraring.com/v2/usercollection/sleep?start_date=2022-11-26&end_date=2022-12-26";

    const OURA_PERSONAL_INFO_URL =
      "https://api.ouraring.com/v2/usercollection/personal_info";

    const OURA_SLEEP_URL = "https://api.ouraring.com/v1/sleep";
    const OURA_ACTIVITY_URL = "https://api.ouraring.com/v1/activity";
    const OURA_READINESS_URL = "https://api.ouraring.com/v1/readiness";
    const OURA_HRV_URL = "https://api.ouraring.com/v1/hrv";
    const OURA_BEDTIME_URL = "https://api.ouraring.com/v1/bedtime";
    const OURA_IDEAL_BEDTIMES_URL =
      "https://api.ouraring.com/v1/ideal_bedtimes";

    const OURA_USER_INFO_URL = "https://api.ouraring.com/v1/userinfo";

    async function checkTokenExpiration(access_token) {
      try {
        const response = await axios.get(OURA_USER_INFO_URL, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        return response.status_code === 200;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(error.response);
          return false;
        }
        throw error;
      }
    }

    const refreshAccessToken = async (
      client_id,
      client_secret,
      refresh_token
    ) => {
      try {
        const response = await axios.post(
          OURA_TOKEN_URL,
          {
            grant_type: "refresh_token",
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: refresh_token,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        return response.data.access_token;
      } catch (error) {
        console.error("Error refreshing access token.");
        throw error;
      }
    };
    try {
      console.log("Token received:", token);
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const PD_user_id = new ObjectId(decodedToken.userId);

      // Find the user in the database using PD_user_id
      const ouraUser = await OuraUser.findOne({ PD_user_id: PD_user_id });

      if (!ouraUser) {
        return res.status(404).send("User not found");
      }
      let { access_token } = ouraUser;

      // Check if the access token is valid
      const isTokenValid = await checkTokenExpiration(access_token);
      console.log(
        "🚀 ~ file: oura.js:192 ~ router.get ~ isTokenValid:",
        isTokenValid
      );
      if (!isTokenValid) {
        // Refresh the access token
        const new_access_token = await refreshAccessToken(
          process.env.OURA_CLIENT_ID,
          process.env.OURA_CLIENT_SECRET,
          ouraUser.refreshToken
        );
        console.log(
          "🚀 ~ file: oura.js:206 ~ router.get ~ new_access_token:",
          new_access_token
        );

        // Update the access token in the database
        ouraUser.access_token = new_access_token;
        await ouraUser.save();

        // Use the new access token for API calls
        access_token = new_access_token;
      }

      const start = "2022-12-18";
      const end = "2022-12-24";

      const test_data = await fetchDataFromEndpoint(
        access_token,
        "sleep",
        start,
        end
      );
      console.log(
        "🚀 ~ file: oura.js:220 ~ router.get ~ test_data:",
        test_data
      );

      res.json({ data: test_data });

      // const sleepData = await fetchDataFromEndpoint(
      //   OURA_SLEEP_URL,
      //   access_token,
      //   start,
      //   end
      // );
      // const activityData = await fetchDataFromEndpoint(
      //   OURA_ACTIVITY_URL,
      //   access_token,
      //   start,
      //   end
      // );
      // const readinessData = await fetchDataFromEndpoint(
      //   OURA_READINESS_URL,
      //   access_token,
      //   start,
      //   end
      // );
      // const hrvData = await fetchDataFromEndpoint(
      //   OURA_HRV_URL,
      //   access_token,
      //   start,
      //   end
      // );
      // const bedtimeData = await fetchDataFromEndpoint(
      //   OURA_BEDTIME_URL,
      //   access_token,
      //   start,
      //   end
      // );
      // const idealBedtimesData = await fetchDataFromEndpoint(
      //   OURA_IDEAL_BEDTIMES_URL,
      //   access_token,
      //   start,
      //   end
      // );

      // console.log("hrvData, ", hrvData);

      // res.json({
      //   sleep: sleepData,
      //   activity: activityData,
      //   readiness: readinessData,
      //   hrv: hrvData,
      //   bedtime: bedtimeData,
      //   ideal_bedtimes: idealBedtimesData,
      // });
      console.log(
        "🚀 ~ file: oura.js:119 ~ router.get ~ access_token:",
        access_token
      );
    } catch (error) {
      console.error("Error fetching Oura data.");
      res.status(500).send("Error fetching Oura data");
    }
  });

  return router;
};
