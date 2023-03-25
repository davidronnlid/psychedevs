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
    console.log("TOKEN 2 IN Backend", userId);
    let logTypes = await collection.findOne({ userId: new ObjectId(userId) });

    const logTypesToSend = logTypes.logTypes;

    console.log("LOGTYPES FROM DB IN Backend", logTypesToSend);

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

  console.log("post req received at /log-types");

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
  } catch (e) {
    console.error(e);
  }

  const newLogType = {
    userId: new ObjectId(userId),
    name: req.body.name,
    question: req.body.question,
    answer_type: req.body.answer,
  };

  const result = await collection.insertOne(newLogType);
  res.status(201).send(result.ops[0]);
});

// Delete a log type
router.delete("/log-types/:id", async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection("log_types");
  const id = req.params.id;

  // Make sure user is authorized to do delete by checking JWT here

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1) {
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

module.exports = router;
