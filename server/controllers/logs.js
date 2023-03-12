const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

module.exports = ({ client }) => {
  const database = client.db("app_users");
  const vas_mood_logs = database.collection("vas_mood_logs");

  // Define a route to handle user login
  router.get("/logs", async (req, res) => {
    console.log("Req received at /vas/logs", req.headers.authorization);

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("token", token, "decodedtoken", decodedToken);

    const userId = decodedToken.userId;

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

  // rest of the code
  return router;
};
