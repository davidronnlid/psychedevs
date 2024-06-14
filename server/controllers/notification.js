const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const tokens = [];

module.exports = () => {
  const router = express.Router();
  router.post("/save-token", (req, res) => {
    const { token } = req.body;
    if (token && !tokens.includes(token)) {
      tokens.push(token);
    }
    res.sendStatus(200);
  });

  router.post("/send-notification", (req, res) => {
    const { title, body } = req.body;

    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    admin
      .messaging()
      .sendMulticast(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        res.sendStatus(500);
      });
  });

  return router;
};
