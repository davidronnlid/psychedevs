const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// GET existing log types
router.get("/log-types", async (req, res) => {
  const db = req.app.locals.db;

  console.log("get req received at /logs/log-types");

  if (!db) {
    res.status(500).send("Database connection not established");
    return;
  }

  const collection = db.collection("log_types");

  try {
    const token = req.headers.authorization.split(" ")[1];

    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const logTypes = await collection.findOne({ userId: userId });
    console.log("🚀 ~ file: logTypes.js:19 ~ router.get ~ logTypes:", logTypes);

    const logTypesToSend = logTypes.logTypes;

    res.status(200).send(logTypesToSend);
  } catch (error) {
    console.error("Error fetching log types data: ", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Add a new log type
router.post("/log-types", async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection("log_types");

  console.log("post req received at /logs/log-types");

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const generateId = (answerFormat, name) => {
      const hash = crypto.createHash("sha256");
      const data = answerFormat + name;
      hash.update(data);
      return hash.digest("hex");
    };

    console.log("req.body", req.body);

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
        },
      ],
    };

    const updateResult = await collection.updateOne(
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

    const logTypes = await collection.findOne({ userId: userId });

    const logTypesToSend = logTypes.logTypes;

    res.status(200).send({ logTypes: logTypesToSend });
  } catch (err) {
    console.error(err);
  }
});

// Delete a log type
router.delete("/log-types", async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection("log_types");

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const namesOfLogTypesToRemove = req.query.names.split(",,");

    const generateId = (answerFormat, name) => {
      const hash = crypto.createHash("sha256");
      const data = answerFormat + name;
      hash.update(data);
      return hash.digest("hex");
    };

    console.log("req.body", req.body);

    const mergedId = generateId(req.body.answer_format, req.body.name);
    console.log(
      "🚀 ~ file: logTypes.js:55 ~ router.post ~ mergedId:",
      mergedId
    );

    const logTypeToSave = {
      logType_id: mergedId,
      logTypes: [
        {
          answer_format: req.body.answer_format,
          name: req.body.name,
          logType_id: mergedId.toString(),
          weekdays: [...req.body.weekdays],
        },
      ],
    };

    const result = await collection.updateOne(
      { userId: userId },
      { $pull: { logTypes: { name: { $in: namesOfLogTypesToRemove } } } }
    );
    console.log("Removed log type from db, ", result);

    const logTypes = await collection.findOne({ userId: userId });

    const logTypesToSend = logTypes.logTypes;

    res.status(200).json(logTypesToSend);
  } catch (error) {
    console.log(error);
  }
});

// Update a log type - corresponds to log type editing UI in frontend
router.put("/log-types", async (req, res) => {
  console.log("/logs/log-types is where the req is at yoo");
  const db = req.app.locals.db;
  const collection = db.collection("log_types");

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    console.log("req.body", req.body);

    const oldLogType = req.body.oldLogType;
    const newLogType = req.body.newLogType;

    const logTypeToUpdate = {
      ...newLogType,
      logType_id: oldLogType.logType_id,
    };

    console.log(
      "🚀 ~ file: logTypes.js:173 ~ router.put ~ logTypeToUpdate:",
      logTypeToUpdate
    );

    const result = await collection.updateOne(
      { userId: userId, "logTypes.logType_id": oldLogType.logType_id },
      {
        $set: {
          "logTypes.$": logTypeToUpdate,
        },
      }
    );

    console.log("Updated log type in db, ", result);

    const logTypes = await collection.findOne({ userId: userId });

    const logTypesToSend = logTypes.logTypes;

    res.status(200).json(logTypesToSend);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
