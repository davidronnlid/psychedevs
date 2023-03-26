const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// GET existing log types
router.get("/log-types", async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection("log_types");

  console.log("get req received at /logs/log-types");

  try {
    const token = req.headers.authorization.split(" ")[1];

    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const logTypes = await collection.findOne({ userId: new ObjectId(userId) });
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

    // If the generateId is already present in collection, then tell user they cannot add log with same name and answer_format as they have already added

    const mergedId = generateId(req.body.answer_format, req.body.name);
    console.log(
      "🚀 ~ file: logTypes.js:55 ~ router.post ~ mergedId:",
      mergedId
    );

    const logTypeToSave = {
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      logTypes: [
        {
          answer_format: req.body.answer_format,
          name: req.body.name,
          logType_id: mergedId.toString(),
          weekdays: [true, true, true, true, true, true, true],
        },
      ],
    };

    const updateResult = await collection.updateOne(
      { userId: new ObjectId(userId) },
      {
        $push: {
          logTypes: logTypeToSave,
        },
      }
    );

    console.log("Tried update-adding log type to db; ", updateResult);

    if (updateResult.modifiedCount !== 1) {
      console.log("Error updating array, trying to insert instead: ");

      console.log(req.body.logType_id);

      const insertedResult = await collection.insertOne(logTypeToSave);
      console.log(
        "🚀 ~ file: logTypes.js:62 ~ router.post ~ insertedResult:",
        insertedResult
      );

      console.log("Inserted! ", insertedResult);
    }

    const logTypes = await collection.findOne({ userId: new ObjectId(userId) });

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

    const result = await collection.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { logTypes: { name: { $in: namesOfLogTypesToRemove } } } }
    );
    console.log("Removed log type from db, ", result);

    const logTypes = await collection.findOne({ userId: new ObjectId(userId) });

    const logTypesToSend = logTypes.logTypes;

    res.status(200).json(logTypesToSend);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
