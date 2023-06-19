const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../models/user");
// const { requiresAuth } = require("express-openid-connect");

module.exports = () => {
  console.log("Router for /auth set up");

  router.get("/signin", (req, res) => {
    if (!req.oidc.isAuthenticated()) {
      res.oidc.login({
        returnTo: req.hostname,
      });
    } else {
      console.log("User already logged in", req.oidc.user);
      const idToken = req.oidc.idToken;
      console.log("🚀 ~ file: index.js:100 ~ app.get ~ idToken:", idToken);
    }
    res.redirect("/auth/signedin");
  });
  router.get("/callback", (req, res) => {
    console.log("In callback function, this is user: ");
    console.log("In callback function, this is user: ", req.oidc.user);

    const id_token = req.oidc.idToken;
    console.log("🚀 ~ file: index.js:112 ~ app.get ~ id_token:", id_token);
    if (req.oidc.isAuthenticated()) {
      const userName = req.oidc.user.name;
      console.log("User name is: ", userName);
      res.redirect(
        `http://localhost:3000/signed-in?name=${encodeURIComponent(userName)}`
      );
    }
  });

  router.get("/signedin", (req, res) => {
    console.log("signedin route working");
    const userName = req.oidc.user.name;

    res.redirect(
      `http://localhost:3000/signed-in?name=${encodeURIComponent(userName)}`
    );
  });
  // User registration route
  router.post("/signup", async (req, res) => {
    console.log("Req received at /auth/signup");

    const { username, password } = req.body;
    try {
      // Generate a salt value
      const salt = await bcrypt.genSalt(10);
      // Hash the password with the salt value
      const hashedPw = await bcrypt.hash(password, salt);

      const newUser = new User({
        // Create a new user using the Mongoose model
        username,
        password: hashedPw,
        _id: new ObjectId(),
      });

      const result = await newUser.save();
      console.log("User registered successfully", result);

      // Generate a JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
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
      const user = await User.findOne({ username });
      console.log("Found user with this username: ", user.username, user);

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
