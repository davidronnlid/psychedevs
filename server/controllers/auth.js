const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { requiresAuth } = require("express-openid-connect");

module.exports = () => {
  console.log("Router for /auth set up");

  // router.post("/callback", (req, res) => {
  //   console.log("in /auth/callback req.oidc", req.oidc);

  //   if (req.oidc.isAuthenticated()) {
  //     console.log("User is: ", req.oidc.idToken);
  //     // Further processing
  //   }
  //   res.redirect("http://localhost:3000");
  //   console.log("User is not authenticated.");
  // });
  router.get("/user", requiresAuth(), async (req, res) => {
    console.log("Response Headers:", res.getHeaders());

    console.log("Route handler for /auth/user");

    console.log("in /auth/user", req.oidc.isAuthenticated());
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
  // router.get("/logout", (req, res) => {
  //   console.log("Route handler for /auth/logout");

  //   if (req.oidc && typeof req.oidc.logout === "function") {
  //     req.oidc.logout({ returnTo: "https://localhost:3000/auth/logged-out" });
  //   } else {
  //     res.send("User is not logged in");
  //   }
  // });

  return router;
};
