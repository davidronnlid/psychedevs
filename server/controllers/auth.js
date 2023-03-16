const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = ({ client }) => {
  const database = client.db("app_users");
  const users = database.collection("user_account_data");

  // User registration route
  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
      // Generate a salt value
      const salt = await bcrypt.genSalt(10);
      // Hash the password with the salt value
      const hashedPassword = await bcrypt.hash(password, salt);

      console.log("Req received at /auth/register");

      // Save the hashed password to the database
      const result = await users.insertOne({
        username,
        password: hashedPassword,
      });
      console.log(result);
      res.status(200).json({ message: "User registered successfully" });
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
      console.log("Looking for user");

      // Find the user by username
      const user = await users.findOne({ username });

      console.log(user.username);

      if (!user) {
        return res.status(404).send();
      }
      // Check if the password is correct
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).send();
      }

      console.log("About to generate JWT token");
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(200).send({ token });
      console.log("User signed in successfully and JWT was sent successfully");
    } catch {
      res.status(500).send();
    }
  });

  // User logout route
  router.post("/logout", async (req, res) => {
    // Implement logout logic here
  });

  // rest of the code
  return router;
};
