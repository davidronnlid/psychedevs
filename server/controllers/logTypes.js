const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");

const Logs = require("../models/logs");
const LogTypes = require("../models/logTypes");

const generateId = (answerFormat, name) => {
  const hash = crypto.createHash("sha256");
  const data = answerFormat + name;
  hash.update(data);
  return hash.digest("hex");
};

module.exports = () => {
  const router = express.Router();

  // GET existing log types
  router.get("/log-types", async (req, res) => {
    console.log("GET req received at /logs/log-types");

    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
      console.log("🚀 ~ file: logTypes.js:19 ~ router.get ~ userId:", userId);

      const logTypes = await LogTypes.findOne({ userId: userId });
      console.log(
        "🚀 ~ file: logTypes.js:19 ~ router.get ~ logTypes:",
        logTypes
      );

      if (logTypes) {
        const logTypesToSend = logTypes.logTypes;
        res.status(200).send(logTypesToSend);
      } else {
        res.status(404).send({ message: "Log types not found" });
      }
    } catch (error) {
      console.error("Error fetching log types data: ", error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  // Add a new log type
  router.post("/log-types", async (req, res) => {
    console.log("post req received at /logs/log-types");

    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const mergedId = generateId(req.body.answer_format, req.body.name);
      console.log(
        "🚀 ~ file: logTypes.js:55 ~ router.post ~ mergedId:",
        mergedId
      );

      const weekdays = req.body.weekdays
        ? [...req.body.weekdays]
        : [true, true, true, true, true, true, true];

      const logTypeToSave = {
        logType_id: mergedId,
        logTypes: [
          {
            answer_format: req.body.answer_format,
            name: req.body.name,
            logType_id: mergedId.toString(),
            weekdays: weekdays,
            unit: req.body.unit,
          },
        ],
      };

      const updateResult = await LogTypes.updateOne(
        { userId: userId },
        {
          $push: {
            logTypes: {
              ...logTypeToSave.logTypes[0],
            },
          },
          $setOnInsert: {
            userId: userId,
          },
        },
        { upsert: true }
      );

      console.log("Upserted log type to db; ", updateResult);

      const logTypes = await LogTypes.findOne({ userId: userId });
      const logTypesToSend = logTypes.logTypes;

      res.status(200).send({ logTypes: logTypesToSend });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  // Delete a log type
  router.delete("/log-types", async (req, res) => {
    console.log("DELETE at /logs/log-types");

    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const namesOfLogTypesToRemove = req.query.names.split(",,");

      const result = await LogTypes.updateOne(
        { userId: userId },
        { $pull: { logTypes: { name: { $in: namesOfLogTypesToRemove } } } }
      );
      console.log("Removed log type from db, ", result);

      const logTypes = await LogTypes.findOne({ userId: userId });
      const logTypesToSend = logTypes.logTypes;

      res.status(200).json(logTypesToSend);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  // Update a log type
  router.put("/log-types", async (req, res) => {
    console.log("/logs/log-types is where the req is at yoo");

    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      console.log("req.body", req.body);

      const newLogType = req.body.newLogType;
      const updatedLogType_id = generateId(
        newLogType.answer_format,
        newLogType.name
      );

      const logTypeToUpdate = {
        ...newLogType,
        logType_id: updatedLogType_id,
      };

      console.log(
        "🚀 ~ file: logTypes.js:173 ~ router.put ~ logTypeToUpdate:",
        logTypeToUpdate
      );

      const oldLogType_id = req.body.oldLogType.logType_id;

      const logTypesUpdateResult = await LogTypes.updateOne(
        { userId: userId, "logTypes.logType_id": oldLogType_id },
        {
          $set: {
            "logTypes.$": logTypeToUpdate,
          },
        }
      );

      const logsUpdateResult = await Logs.updateMany(
        {
          user_id: new ObjectId(userId),
        },
        {
          $set: {
            "logs.$[elem].logType_id": updatedLogType_id,
          },
        },
        {
          arrayFilters: [{ "elem.logType_id": oldLogType_id }],
        }
      );

      console.log("Updated log type in db, ", logTypesUpdateResult);

      if (logsUpdateResult) {
        const logDocument = await Logs.findOne({
          user_id: new ObjectId(userId),
        });
        console.log("Updated logs in db, ", logDocument);
      }

      const logTypes = await LogTypes.findOne({ userId: userId });
      const logTypesToSend = logTypes.logTypes;

      res.status(200).json(logTypesToSend);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  return router;
};
