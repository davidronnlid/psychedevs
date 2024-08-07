const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const secondsToHours = (seconds) => {
  const hours = seconds / 3600;
  return hours;
};

function secondsToMinutes(seconds) {
  const minutes = seconds / 60;
  return minutes;
}

const router = express.Router();
const OURA_AUTH_URL = "https://cloud.ouraring.com/oauth/authorize";
const OuraUser = require("../models/ouraUser");

const axios = require("axios");
const OURA_TOKEN_URL = "https://api.ouraring.com/oauth/token";

const sleepLogTypes = [
  {
    logType: "average_breath",
    logTypeName: "Respiratory rate",
    unit: "breaths / Minute",
  },
  {
    logType: "average_heart_rate",
    logTypeName: "Average heart rate",
    unit: "beats / Minute",
  },
  {
    logType: "average_hrv",
    logTypeName: "Average heart rate variability",
    unit: "milliseconds",
  },
  {
    logType: "deep_sleep_duration",
    logTypeName: "Deep sleep duration",
    unit: "hours",
  },
  {
    logType: "latency",
    logTypeName: "Time to fall asleep",
    unit: "minutes",
  },
  {
    logType: "light_sleep_duration",
    logTypeName: "Light sleep duration",
    unit: "hours",
  },
  {
    logType: "rem_sleep_duration",
    logTypeName: "REM sleep duration",
    unit: "hours",
  },
  {
    logType: "time_in_bed",
    logTypeName: "Time in bed",
    unit: "hours",
  },
  {
    logType: "total_sleep_duration",
    logTypeName: "Total sleep duration",
    unit: "hours",
  },
];

const dailyActivityLogTypes = [
  {
    logType: "active_calories",
    logTypeName: "Calories burned while active",
    unit: "calories",
  },
  {
    logType: "average_met_minutes",
    logTypeName: "Average MET minutes",
    unit: "average MET minutes",
  },
  {
    logType: "resting_time",
    logTypeName: "Resting time",
    unit: "hours",
  },
  {
    logType: "steps",
    logTypeName: "Steps",
    unit: "number",
  },
];

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
    console.log("🚀 ~ fetchDataFromEndpoint ~ url:", url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      data: response.data.data,
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
          ? "https://localhost:3000"
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

    const logTypeIds = req.query.logTypeId;
    console.log(
      "🚀 ~ file: oura.js:177 ~ router.get ~ logTypeIds:",
      logTypeIds
    );

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const PD_user_id = new ObjectId(decodedToken.userId);

      const ouraUser = await OuraUser.findOne({ PD_user_id: PD_user_id });

      if (!ouraUser) {
        return res.status(404).send("User not found");
      }
      let { access_token } = ouraUser;

      const start = req.query.startDate;
      const end = req.query.endDate;

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

      const convertSecondsToHours = [
        "deep_sleep_duration",
        "total_sleep_duration",
        "resting_time",
        "light_sleep_duration",
        "rem_sleep_duration",
        "time_in_bed",
      ];
      const convertSecondsToMinutes = ["latency"];

      const filterLogsByLogType = (logs, logTypeId) => {
        return logs
          .map((log) => {
            if (log[logTypeId] !== undefined) {
              let value;
              if (convertSecondsToHours.includes(logTypeId)) {
                value = secondsToHours(log[logTypeId]);
              } else if (convertSecondsToMinutes.includes(logTypeId)) {
                value = secondsToMinutes(log[logTypeId]);
              } else {
                value = log[logTypeId];
              }
              return {
                id: log.id,
                day: log.day,
                [logTypeId]: value,
              };
            }
          })
          .filter((log) => log !== undefined);
      };

      const validSleepLogTypes = logTypeIds.filter((logTypeId) =>
        sleepLogTypes.some((logType) => logType.logType === logTypeId)
      );

      const validDailyActivityLogTypes = logTypeIds.filter((logTypeId) =>
        dailyActivityLogTypes.some((logType) => logType.logType === logTypeId)
      );

      const validLogTypes = [
        ...validSleepLogTypes,
        ...validDailyActivityLogTypes,
      ];

      if (validLogTypes.length === 0) {
        return res.status(400).send("Invalid logTypeIds");
      }

      const dataPromises = [];
      if (validLogTypes.length === 0) {
        return res.status(400).send("Invalid logTypeIds");
      }

      if (validSleepLogTypes.length > 0) {
        dataPromises.push(
          (async () => {
            const data = await fetchWithTokenRefresh("sleep");
            return validSleepLogTypes.map((logTypeId) => ({
              logTypeId,
              data: data.data,
            }));
          })()
        );
      }

      if (validDailyActivityLogTypes.length > 0) {
        dataPromises.push(
          (async () => {
            const data = await fetchWithTokenRefresh("daily_activity");
            return validDailyActivityLogTypes.map((logTypeId) => ({
              logTypeId,
              data: data.data,
            }));
          })()
        );
      }

      const allData = (await Promise.all(dataPromises)).flat();
      console.log("🚀 ~ router.get ~ allData:", allData);

      const filteredData = allData.reduce((acc, { logTypeId, data }) => {
        const logs = filterLogsByLogType(data, logTypeId);

        if (!acc[logTypeId]) {
          acc[logTypeId] = [];
        }
        acc[logTypeId] = [...acc[logTypeId], ...logs];
        return acc;
      }, {});

      console.log(
        "🚀 ~ file: oura.js:335 ~ router.get ~ filteredData:",
        filteredData
      );

      res.json(filteredData);
    } catch (error) {
      console.error("Error fetching Oura data.", error);
      res.status(500).send("Error fetching Oura data");
    }
  });

  router.get("/log-type-categories", async (req, res) => {
    console.log("Received GET req at /oura/log-type-categories");

    const log_type_categories = req.query.log_type_categories.split(",");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
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

  router.get("/log-types/sleep", async (req, res) => {
    console.log("Received GET req at /log-types/sleep");

    try {
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

  router.get("/log-types/daily_activity", async (req, res) => {
    console.log("Received GET req at /log-types/daily_activity");

    try {
      res.json({ daily_activity: dailyActivityLogTypes, sleep: null });
    } catch (error) {
      console.error(
        "Error fetching daily activity log types.",
        error.message,
        error.stack
      );
      res.status(500).send("Error fetching sleep log types");
    }
  });

  return router;
};
