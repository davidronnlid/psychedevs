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

    const result = await collection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: { logTypes: req.body } }
    );

    if (result.modifiedCount !== 1) {
      console.log("Error adding item to array");
      res.sendStatus(500);
      return;
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
    console.log(result);

    const logTypes = await collection.findOne({ userId: new ObjectId(userId) });

    const logTypesToSend = logTypes.logTypes;

    res.status(200).json(logTypesToSend);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
