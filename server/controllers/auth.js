const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = ({ client }) => {
  const database = client.db("app_users");
  const users = database.collection("user_account_data");

  // User registration route
  router.post("/signup", async (req, res) => {
    console.log("Req received at /auth/signup");

    const { username, password } = req.body;
    try {
      // Generate a salt value
      const salt = await bcrypt.genSalt(10);
      // Hash the password with the salt value
      const hashedPw = await bcrypt.hash(password, salt);

      const newUser = {
        username,
        password: hashedPw,
      };

      // Save the hashed password to the database
      const result = await users.insertOne(newUser);
      console.log("User registered successfully", result);

      const user = await users.findOne({ username: newUser.username });
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(200).send({ token });
      console.log("JWT was sent successfully to logged in user");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error registering user" });
    }
  });

  // User login route
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log("Req received at /auth/login");

    try {
      // Find the user by username
      const user = await users.findOne({ username });
      console.log("Found user with this username: ", user.username);

      if (!user) {
        return res.status(404).send();
      }
      // Check if the password is correct
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).send();
      }

      console.log("Password correct! About to generate JWT token.");
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(200).send({ token });
      console.log("JWT was sent successfully to logged in user");
    } catch {
      res.status(500).send();
    }
  });

  // User logout route
  router.post("/logout", async (req, res) => {
    // Implement logout logic here
    // As user logs out, their JWT should be deleted - not sure yet if this should be implemented in the front or backend tho
  });

  return router;
};
