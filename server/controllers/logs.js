const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const Logs = require("../models/logs");
const moment = require("moment");

module.exports = () => {
  console.log("Router for /logs set up");

  // Define a get route to let users see their logged data
  router.get("/logs", async (req, res) => {
    const db = req.app.locals.db;
    const vas_mood_logs = db.collection("vas_mood_logs");
    console.log("GET Req received at /vas/logs");

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decodedToken.userId);
    console.log("decodedToken.userId:", decodedToken.userId);
    console.log("userId:", userId);
    try {
      const logsQuery = { user_id: new ObjectId(userId) };
      const foundUserLogs = await vas_mood_logs.findOne(logsQuery);
      console.log("foundUserLogs:", foundUserLogs);

      if (foundUserLogs) {
        console.log("Found some user logs: " + foundUserLogs.logs);
        res.status(200).json(foundUserLogs.logs);
      } else {
        console.log(
          "No logs found for this user, the foundUserLogs object returned: ",
          foundUserLogs
        );
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
      "POST Req received at /vas/logs with the following req.headers.authorization and req.body parameters",
      req.headers.authorization,
      req.body
    );

    const db = req.app.locals.db;
    const vas_mood_logs = db.collection("vas_mood_logs");
    const submittedLog = req.body;
    const dateString = submittedLog.date;
    const value = submittedLog.value;

    // assuming that the date string is in the format "YYYY-MM-DD"
    // convert the date string to a Date object
    const date = moment(dateString, "YYYY-MM-DD").toDate();

    // create the log object with the date string converted to a date Date object
    const datifiedSubmittedLog = { date: date, value: value };
    // the submitted log object will be inserted into the database below

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new ObjectId(decodedToken.userId);
    console.log("JWT-derived userId is " + userId);

    try {
      const logsQuery = { user_id: userId };
      const foundUserLogs = await vas_mood_logs.findOne(logsQuery);

      if (foundUserLogs) {
        console.log(
          "about to update existing array of logs for this user with datifiedSubmittedLog"
        );

        const logged = await vas_mood_logs.updateOne(
          { user_id: new ObjectId(userId) }, // The filter to match the document to update
          { $push: { logs: datifiedSubmittedLog } } // The update operation to perform
        );
        console.log("User log updated!! " + logged);
        res.status(200).json(foundUserLogs.logs);
      } else {
        console.log(
          "about to create new array of logs for this user with the following data submitted by the user: ",
          datifiedSubmittedLog,
          userId
        );

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
