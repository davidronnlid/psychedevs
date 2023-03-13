const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const connectToDB = require("../dbConnect");
const createClient = async () => {
  try {
    const client = await connectToDB();
    console.log("Connected to MongoDB in followC.js");
    const { User, addFollower } = require("../models/followM")({ client });
  } catch (error) {
    console.error(error);
  }
};
createClient();

//   const database = client.db("app_users");
//   const user_account_data_collection = database.collection("user_account_data");

module.exports = ({ client }) => {
  // Define a post route to let users update who they follow
  router.post("/:id", async (req, res) => {
    // Formatting req query to be only the boolean of interest, which represents the isFollowing boolean in the React component
    const [firstKey, ...restKeys] = Object.keys(req.query);
    const firstKeyBoolean = firstKey === "true" || firstKey === true;

    const followedUserId = req.params.id;

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = new ObjectId(decodedToken.userId);

    try {
      // console.log(
      //   "This will be User",
      //   addFollower(followedUserId, userId),
      //   User
      // );
      const addFollowerResult = addFollower(followedUserId, userId);
      console.log(addFollowerResult);
      //   const foundUser = await User.findOne({
      //     _id: userId,
      //   });
      //   console.log("followFoundUser", foundUser);

      //   followedUserId

      if (firstKeyBoolean) {
        // Logic for adding followstatus relationships
      } else {
        // logic for removing followstatus relationships
      }

      //   if (foundUsers) {
      //     res.status(200).json(foundUsers);
      //   } else {
      //     console.log("No found for this user", foundUsers);
      //     res.status(404).json({ message: "No found for this user" });
      //   }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding user" });
    }
  });

  //   router.get("/:id", async (req, res) => {
  //     console.log("req received at :id");
  //     const token = req.headers.authorization.split(" ")[1];

  //     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  //     console.log("token", token, "decodedtoken", decodedToken);

  //     const userId = new ObjectId(decodedToken.userId);

  //     console.log("JWT userId is " + userId);

  //     const user_Id = req.params.id;

  //     try {
  //       const foundUser = await user_account_data_collection.findOne({
  //         _id: new ObjectId(user_Id),
  //       });

  //       console.log("Found user", foundUser);

  //       if (foundUser) {
  //         console.log("Found user", foundUser);
  //         res.status(200).json(foundUser);
  //       } else {
  //         console.log("No found for this user", foundUser);
  //         res.status(404).json({ message: "No found for this user" });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ message: "Error finding user" });
  //     }
  //   });

  return router;
};
