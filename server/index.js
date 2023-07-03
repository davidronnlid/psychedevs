const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const { ObjectId } = require("mongodb");
const OuraUser = require("./models/ouraUser");
const OAuth2Strategy = require("passport-oauth2");

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

const authRouter = require("./controllers/auth");
const vasRouter = require("./controllers/logs");
const usersRouter = require("./controllers/users");
const logsRouter = require("./controllers/logTypes");
const ouraRouter = require("./controllers/oura");

const connectToDB = require("./dbConnect");

app.use("/uploads", express.static("uploads"));

app.use("/users", usersRouter());
app.use("/vas", vasRouter());
app.use("/logs", logsRouter);
app.use("/oura", ouraRouter());
app.use("/auth", authRouter());

(async () => {
  try {
    await connectToDB();

    console.log("All routers are set up");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
})();

app.use(passport.initialize());

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://cloud.ouraring.com/oauth/authorize",
      tokenURL: "https://api.ouraring.com/oauth/token",
      clientID: process.env.OURA_CLIENT_ID,
      clientSecret: process.env.OURA_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "development"
          ? process.env.OURA_REDIRECT_URI_LOCAL
          : process.env.OURA_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user_id = profile.id;
      const existingOuraUser = await OuraUser.findOne({ ouraId: user_id });

      if (existingOuraUser) {
        existingOuraUser.accessToken = accessToken;
        existingOuraUser.refreshToken = refreshToken;
        await existingOuraUser.save();
        done(null, existingOuraUser);
      } else {
        const newOuraUser = new OuraUser({
          ouraId: user_id,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
        await newOuraUser.save();
        done(null, newOuraUser);
      }
    }
  )
);

const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  // AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
