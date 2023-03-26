const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

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

    console.log("req.body", req.body);

    // Also add logic to handle case where name of log type is already in the collection

    const updateResult = await collection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: { logTypes: req.body } }
    );

    console.log("Tried update-adding log type to db; ", updateResult);

    if (updateResult.modifiedCount !== 1) {
      console.log("Error updating array, trying to insert instead: ");

      console.log(req.body.logType_id);

      if (
        req.body.logType_id === "1-5 Visual Analogue Scale for current mood"
      ) {
        const insertedResult = await collection.insertOne({
          _id: new ObjectId(),
          userId: new ObjectId(userId),
          logTypes: [
            {
              name: "How do you feel right now?",
              answer_format: "1-5 Visual Analogue Scale for mood",
              logType_id: "1-5 Visual Analogue Scale for current mood",
            },
          ],
        });
        console.log(
          "🚀 ~ file: logTypes.js:62 ~ router.post ~ insertedResult:",
          insertedResult
        );
      }
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
