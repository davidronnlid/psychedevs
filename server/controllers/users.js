const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

module.exports = ({ client }) => {
  const database = client.db("app_users");
  const user_account_data_collection = database.collection("user_account_data");

  // Define a get route to let users see their logged data
  router.get("/", async (req, res) => {
    console.log("GET Req received at users/", req);

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("token", token, "decodedtoken", decodedToken);

    const userId = new ObjectId(decodedToken.userId);

    console.log("JWT userId is " + userId);

    try {
      const foundUsers = await user_account_data_collection
        .find({
          _id: { $ne: userId },
        })
        .toArray();

      if (foundUsers) {
        res.status(200).json(foundUsers);
      } else {
        console.log("No found for this user", foundUsers);
        res.status(404).json({ message: "No found for this user" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding user" });
    }
  });

  router.get("/:id", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("token", token, "decodedtoken", decodedToken);

    const userId = new ObjectId(decodedToken.userId);

    console.log("JWT userId is " + userId);

    const user_Id = req.params.id;

    try {
      const foundUser = await user_account_data_collection.findOne({
        _id: new ObjectId(user_Id),
      });

      console.log("Found user", foundUser);

      if (foundUser) {
        console.log("Found user", foundUser);
        res.status(200).json(foundUser);
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
