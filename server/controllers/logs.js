const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const Logs = require("../models/logs");
const moment = require("moment");

module.exports = ({ client }) => {
  const database = client.db("app_users");
  const vas_mood_logs = database.collection("vas_mood_logs", {
    noReflection: true,
  });
  console.log("Router for logs set up");

  // Define a get route to let users see their logged data
  router.get("/logs", async (req, res) => {
    console.log("GET Req received at /vas/logs", req.headers.authorization);

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("token", token, "decodedtoken", decodedToken);

    const userId = new ObjectId(decodedToken.userId);

    console.log("JWT userId is " + userId);

    try {
      const logsQuery = { user_id: userId };
      const foundUserLogs = await vas_mood_logs.findOne(logsQuery);

      if (foundUserLogs) {
        console.log("User logs " + foundUserLogs.logs);
        res.status(200).json(foundUserLogs.logs);
      } else {
        console.log("No logs found for this user", foundUserLogs);
        res.status(404).json({ message: "No logs found for this user" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding user logs" });
    }
  });

  // Define a POST route to let users log data
  router.post("/logs", async (req, res) => {
    console.log(
      "POST Req received at /vas/logs",
      req.headers.authorization,
      req.body
    );

    const submittedLog = req.body;

    // assuming that the date string is in the format "YYYY-MM-DD"
    const dateString = submittedLog.date;

    // convert the date string to a Date object
    const date = moment(dateString, "YYYY-MM-DD").toDate();
    const value = submittedLog.value;

    console.log(date, value);
    // create the log object with the converted date
    const datifiedSubmittedLog = { date: date, value: value };

    // insert the log object into the database

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("token", token, "decodedtoken", decodedToken);

    const userId = new ObjectId(decodedToken.userId);

    console.log("JWT userId is " + userId);

    try {
      const logsQuery = { user_id: userId };
      const foundUserLogs = await vas_mood_logs.findOne(logsQuery);

      if (foundUserLogs) {
        console.log("about to update log");

        const logged = await vas_mood_logs.updateOne(
          { user_id: new ObjectId(userId) }, // The filter to match the document to update
          { $push: { logs: submittedLog } } // The update operation to perform
        );
        console.log("User log updated!! " + logged);
        res.status(200).json(foundUserLogs.logs);
      } else {
        console.log("about to save new log", submittedLog, userId);

        try {
          const result = await vas_mood_logs.insertOne({
            _id: new ObjectId(),
            logs: [datifiedSubmittedLog],
            user_id: new ObjectId(userId),
          });
          console.log(`New log inserted with _id: ${result.insertedId}`);
          res.status(201).json(result);
        } catch (error) {
          console.error(`Error inserting new log: ${error}`);
          res.status(500).json({ message: "Error inserting new log" });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding user logs" });
    }
  });
  return router;
};
