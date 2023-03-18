const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

module.exports = () => {
  console.log("Router for /users set up");

  router.get("/user-id", async (req, res) => {
    const db = req.app.locals.db;
    const user_account_data_collection = db.collection("user_account_data");

    console.log("Received req at /users/user-id");
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = new ObjectId(decodedToken.userId);

    try {
      const foundUser = await user_account_data_collection.findOne({
        _id: userId,
      });

      if (foundUser) {
        console.log("Found user id", foundUser._id);
        res.status(200).json(foundUser._id);
      } else {
        console.log("No found for this user", foundUser);
        res.status(404).json({ message: "No found for this user" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding user" });
    }
  });

  router.get("/user-profile", async (req, res) => {
    const db = req.app.locals.db;
    const user_account_data_collection = db.collection("user_account_data");

    console.log("Received req at /users/user-profile");
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("token", token, "decodedtoken", decodedToken);

    const userId = new ObjectId(decodedToken.userId);

    console.log("JWT userId is " + userId);

    try {
      const foundUser = await user_account_data_collection.findOne({
        _id: userId,
      });

      console.log("Found user", foundUser);

      const userToSend = {
        _id: foundUser._id,
        username: foundUser.username,
      };

      if (userToSend) {
        res.status(200).json(userToSend);
      } else {
        console.log("No found for this user", foundUser);
        res.status(404).json({ message: "No found for this user" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding user" });
    }
  });

  return router;
};
