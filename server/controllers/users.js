const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const multer = require("multer");
// for profile-pic feature

module.exports = () => {
  console.log("Router for /users set up");

  router.get("/user-id", async (req, res) => {
    console.log("Received req at /users/user-id");
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.userId;

    try {
      const foundUser = await User.findOne({ _id: userId });

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
    console.log("Received req at /users/user-profile");

    try {
      const token = req.headers.authorization.split(" ")[1];

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decodedToken.userId;

      const foundUser = await User.findOne({ _id: userId });

      const userToSend = {
        _id: foundUser._id,
        username: foundUser.username,
        profile_pic_filename: foundUser.profile_pic
          ? foundUser.profile_pic.filename
          : null,
      };

      if (userToSend) {
        res.status(200).json(userToSend);
      } else {
        res.status(404).json({ message: "No found for this user" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding user" });
    }
  });

  // for profile-pic feature
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/profile-pics"); // specify the directory where you want to store the images
    },
    filename: function (req, file, cb) {
      console.log("file: ", file, file.originalname);
      cb(null, file.originalname); // use the original filename as the filename
    },
  });

  const upload = multer({ storage: storage });

  // Handle file upload
  router.post("/profile-pic", upload.single("image"), async (req, res) => {
    console.log("Received req at /users/profile-pic");
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("token", token, "decodedtoken", decodedToken);

    const userId = decodedToken.userId;

    console.log("JWT userId is " + userId);

    try {
      const foundUser = await User.findOne({ _id: userId });

      console.log("Found user id: ", foundUser._id);

      if (!foundUser) {
        return res.status(404).json({ error: "User account not found" });
      }

      const result = await User.updateOne(
        { _id: foundUser._id },
        { $set: { profile_pic: req.file } }
      );

      console.log(`Updated ${result.modifiedCount} document(s)`);
      res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully!",
      });

      console.log(
        "This is now the profile picture stored in the database: " +
          foundUser.profile_pic.originalname
      );

      res.status(200).json({ success: true, data: foundUser.profile_pic });
      // After saving the profile picture to the db, it is fetched from the db straight away and sent back to the client, this ensures that if the user can see the picture after having uploaded it, it has been successfully stored to the db
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};
