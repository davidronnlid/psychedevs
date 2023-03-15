const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

module.exports = ({ client }) => {
  const database = client.db("app_users");
  const vas_mood_logs = database.collection("vas_mood_logs");

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

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("token", token, "decodedtoken", decodedToken);

    const userId = new ObjectId(decodedToken.userId);

    console.log("JWT userId is " + userId);

    try {
      const logsQuery = { user_id: userId };
      const foundUserLogs = await vas_mood_logs.findOne(logsQuery);

      console.log("Insert userData here!!!", foundUserLogs.logs);

      if (foundUserLogs) {
        const logged = await vas_mood_logs.updateOne(
          { user_id: new ObjectId(userId) }, // The filter to match the document to update
          { $push: { logs: submittedLog } } // The update operation to perform
        );
        console.log("User log updated!! " + logged);
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
  return router;
};
