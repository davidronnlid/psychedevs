const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const router = express.Router();
const OURA_AUTH_URL = "https://cloud.ouraring.com/oauth/authorize";
const OuraUser = require("../models/ouraUser");

const axios = require("axios");
const OURA_TOKEN_URL = "https://api.ouraring.com/oauth/token";

const refreshAccessToken = async (client_id, client_secret, refresh_token) => {
  console.log(
    client_id,
    client_secret,
    refresh_token,
    " in refreshAccessToken!!"
  );
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
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    };
  } catch (error) {
    console.error("Error refreshing access token.");
    throw error;
  }
};
async function fetchDataFromEndpoint(accessToken, dataType, start, end) {
  const url = `https://api.ouraring.com/v2/usercollection/${dataType}?start_date=${start}&end_date=${end}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      data: response.data,
      error: false,
    };
  } catch (error) {
    console.error(`Error fetching data from ${url}.`);
    console.error("Error response:", error.response.data);
    throw error;
  }
}

async function handleTokenRefresh(PD_user_id) {
  const ouraUser = await OuraUser.findOne({ PD_user_id: PD_user_id });
  const { access_token: new_access_token, refresh_token: new_refresh_token } =
    await refreshAccessToken(
      process.env.OURA_CLIENT_ID,
      process.env.OURA_CLIENT_SECRET,
      ouraUser.refreshToken
    );

  // Update the access token and refresh token in the database
  ouraUser.access_token = new_access_token;
  ouraUser.refreshToken = new_refresh_token;
  await ouraUser.save();

  return new_access_token;
}

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
      scope: "daily",
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

  router.get("/logs", async (req, res) => {
    console.log("Received GET req at /oura/logs");
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const PD_user_id = new ObjectId(decodedToken.userId);

      // Find the user in the database using PD_user_id
      const ouraUser = await OuraUser.findOne({ PD_user_id: PD_user_id });

      if (!ouraUser) {
        return res.status(404).send("User not found");
      }
      let { access_token } = ouraUser;

      const start = "2022-11-18";
      const end = "2022-12-24";

      const fetchWithTokenRefresh = async (dataType) => {
        try {
          return await fetchDataFromEndpoint(
            access_token,
            dataType,
            start,
            end
          );
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.log("Refreshing access token...");
            access_token = await handleTokenRefresh(PD_user_id);
            return await fetchDataFromEndpoint(
              access_token,
              dataType,
              start,
              end
            );
          } else {
            throw error;
          }
        }
      };

      const sleep = await fetchWithTokenRefresh("sleep");
      const daily_activity = await fetchWithTokenRefresh("daily_activity");

      console.log("Sample of what will be sent to client: ", daily_activity);

      res.json({
        daily_activity: daily_activity,
        sleep: sleep,
      });
    } catch (error) {
      console.error("Error fetching Oura data.");
      res.status(500).send("Error fetching Oura data");
    }
  });

  router.get("/log-types/sleep", async (req, res) => {
    console.log("Received GET req at /log-types/sleep");

    // deep_sleep_duration: number;
    // efficiency: number;
    // heart_rate: {
    //   interval: number;
    //   items: number[];
    //   timestamp: string;
    // };
    // hrv: {
    //   interval: number;
    //   items: number[];
    //   timestamp: string;
    // };
    // latency: number;
    // light_sleep_duration: number;
    // low_battery_alert: boolean;
    // lowest_heart_rate: number;
    // movement_30_sec: string;
    // period: number;
    // readiness: {
    //   contributors: { [key: string]: number };
    //   score: number;
    //   temperature_deviation: number;
    //   temperature_trend_deviation: number;
    // };
    // readiness_score_delta: number;
    // rem_sleep_duration: number;
    // restless_periods: number;
    // sleep_phase_5_min: string;
    // sleep_score_delta: number;
    // time_in_bed: number;
    // total_sleep_duration: number;

    // awake_time: number;
    // bedtime_end: string;
    // bedtime_start: string;
    // day: string;
    try {
      const sleepLogTypes = [
        {
          logTypeName: "Respiratory rate",
          unit: "Breaths per minute",
        },
        {
          logTypeName: "Average heart rate",
          unit: "Beats per minute",
        },
        {
          logTypeName: "Average heart rate variability",
          unit: "milliseconds",
        },
      ];

      res.json({ daily_activity: null, sleep: sleepLogTypes });
    } catch (error) {
      console.error(
        "Error fetching sleep log types.",
        error.message,
        error.stack
      );
      res.status(500).send("Error fetching sleep log types");
    }
  });

  router.get("/log-type-categories", async (req, res) => {
    console.log("Received GET req at /oura/log-type-categories");

    const log_type_categories = req.query.log_type_categories.split(",");

    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const PD_user_id = new ObjectId(decodedToken.userId);

      const ouraUser = await OuraUser.findOne({ PD_user_id: PD_user_id });

      if (!ouraUser) {
        return res.status(404).send("User not found");
      }

      let { accessToken } = ouraUser;

      const start = "2022-11-18";
      const end = "2022-12-24";

      const fetchWithTokenRefresh = async (dataType) => {
        try {
          return await fetchDataFromEndpoint(accessToken, dataType, start, end);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.log("Refreshing access token...");
            accessToken = await handleTokenRefresh(PD_user_id);
            return await fetchDataFromEndpoint(
              accessToken,
              dataType,
              start,
              end
            );
          } else {
            throw error;
          }
        }
      };

      const fetchedData = {};
      console.log(
        "🚀 ~ file: oura.js:328 ~ router.get ~ fetchedData:",
        fetchedData
      );
      for (const category of log_type_categories) {
        try {
          await fetchWithTokenRefresh(category);
          fetchedData[category] = true;
        } catch (error) {
          if (error.response && error.response.status === 401) {
            fetchedData[category] = false;
          } else {
            throw error;
          }
        }
      }
      console.log(
        "🚀 ~ file: oura.js:345 ~ router.get ~ fetchedData:",
        fetchedData
      );

      res.json(fetchedData);
    } catch (error) {
      console.error(
        "Error fetching Oura log types.",
        error.message,
        error.stack
      );
      res.status(500).send("Error fetching Oura log types");
    }
  });

  return router;
};
