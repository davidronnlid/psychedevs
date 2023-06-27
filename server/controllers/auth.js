const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { requiresAuth } = require("express-openid-connect");

module.exports = () => {
  console.log("Router for /auth set up");

  router.get("/signin", (req, res) => {
    console.log("Route handler for /auth/signin");
    if (!req.oidc.isAuthenticated()) {
      return res.oidc.login({
        returnTo: "/auth/callback",
      });
    } else {
      console.log("User already logged in", req.oidc.user);
      const idToken = req.oidc.idToken;
      console.log("🚀 ~ file: index.js:100 ~ app.get ~ idToken:", idToken);
    }
    res.redirect("http://localhost:3000");
  });
  router.post("/callback", requiresAuth(), (req, res) => {
    console.log("Route handler for /auth/callback");

    console.log("In callback function, this is user: ", req.oidc.user);

    // const id_token = req.oidc.idToken;
    if (req.oidc.isAuthenticated()) {
      const userName = req.oidc.user.name;
      console.log("User name is: ", userName);
      res.redirect(
        `http://localhost:3000/signed-in?name=${encodeURIComponent(userName)}`
      );
    }
  });

  router.get("/user", requiresAuth(), async (req, res) => {
    console.log("Route handler for /auth/user");

    console.log("in /auth/user", req.oidc.user);
    // Current problem to be solved is here, where the logged in user doesn't seem to be persisted / consistently accessible

    try {
      let userWithoutPassword = {};

      if (req.oidc.user) {
        const { password, ...temp } = req.oidc.user;
        userWithoutPassword = temp;

        console.log(
          "🚀 ~ file: auth.js:53 ~ router.get ~ userWithoutPassword:",
          userWithoutPassword
        );
        // Create a new user using the Mongoose model
        const newUser = new User({
          user_id: userWithoutPassword.sub,
        });

        // Save the new user
        const userInDB = await newUser.save();
        console.log("🚀 ~ file: auth.js:70 ~ router.get ~ result:", userInDB);

        const token = jwt.sign(
          { userId: userWithoutPassword.sub },
          process.env.JWT_SECRET
        );

        console.log("JWT was sent successfully to logged in user");

        return res.status(200).send({ token, userWithoutPassword }); // Make sure to return here to prevent further execution
      } else {
        return res.status(404).send("User not found");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("User creation or JWT creation failed");
    }
  });

  // User logout route
  router.get("/logout", (req, res) => {
    console.log("Route handler for /auth/logout");

    if (req.oidc && typeof req.oidc.logout === "function") {
      req.oidc.logout({ returnTo: "https://localhost:3000/auth/logged-out" });
    } else {
      res.send("User is not logged in");
    }
  });

  return router;
};
