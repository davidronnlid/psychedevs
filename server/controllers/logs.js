const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const Logs = require("../models/logs");
const moment = require("moment");
const { Long } = require("bson");
const crypto = require("crypto");

module.exports = () => {
  console.log("Router for /logs set up");

  // Define a get route to let users see their logged data
  router.get("/logs", async (req, res) => {
    const db = req.app.locals.db;
    const vas_mood_logs = db.collection("vas_mood_logs");
    // vas_mood_logs is now the collection for logs of ALL log types, not just VAS's for mood
    console.log("GET Req received at /vas/logs");
    console.log("Request headers:", req.headers);

    const token = req.headers.authorization.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid token" });
      return;
    }
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
    const logType_id = submittedLog.logType_id;

    const int64Value = Long.fromString(submittedLog.value.toString());

    // console.log("turned into int64: ", int64Value);

    // // assuming that the date string is in the format "YYYY-MM-DD"
    // // convert the date string to a Date object
    const date = moment(dateString, "YYYY-MM-DD").toDate();

    // const generateId = (answerFormat, name) => {
    //   const hash = crypto.createHash("sha256");
    //   const data = answerFormat + name;
    //   hash.update(data);
    //   return hash.digest("hex");
    // };

    // console.log(
    //   "Generating id: ",
    //   req.body.answer_format,
    //   req.body.name,
    //   generateId(req.body.answer_format, req.body.name)
    // );

    // const mergedId = generateId(req.body.answer_format, req.body.name);

    // create the log object with the date string converted to a date Date object
    const datifiedSubmittedLog = {
      _id: new ObjectId(),
      date: date,
      value: int64Value,
      logType_id: logType_id,
    };
    console.log(
      "🚀 ~ file: logs.js:99 ~ router.post ~ datifiedSubmittedLog:",
      datifiedSubmittedLog
    );
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

  // Delete a log type
  router.delete("/logs", async (req, res) => {
    const db = req.app.locals.db;
    const collection = db.collection("vas_mood_logs");

    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const idsOfLogsToRemove = req.query.ids.split(",,");
      console.log(
        "🚀 ~ file: logs.js:137 ~ router.delete ~ idsOfLogsToRemove:",
        idsOfLogsToRemove
      );

      const objectIdsOfLogsToRemove = idsOfLogsToRemove.map(
        (id) => new ObjectId(id)
      );

      const result = await collection.updateOne(
        { user_id: new ObjectId(userId) },
        { $pull: { logs: { _id: { $in: objectIdsOfLogsToRemove } } } }
      );
      console.log(result);

      const logs = await collection.findOne({
        user_id: new ObjectId(userId),
      });
      console.log("🚀 ~ file: logs.js:151 ~ router.delete ~ logs:", logs);

      const logsToSend = logs.logs;

      res.status(200).json(logsToSend);
    } catch (error) {
      console.log(error);
    }
  });

  router.put("/logs", async (req, res) => {
    const db = req.app.locals.db;
    const collection = db.collection("vas_mood_logs");

    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const logsToUpdate = req.body;

      const updateOperations = logsToUpdate.map((log) => {
        return {
          updateOne: {
            filter: {
              user_id: new ObjectId(userId),
              "logs._id": new ObjectId(log._id),
            },
            update: { $set: { "logs.$.value": log.value } },
          },
        };
      });

      const result = await collection.bulkWrite(updateOperations);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
