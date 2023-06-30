const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const passport = require("passport");
const OuraUser = require("./models/ouraUser");
const OAuth2Strategy = require("passport-oauth2");
const { auth } = require("express-openid-connect");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // or your client origin
    credentials: true, // this allows cookies to be sent
  })
);

const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cookieParser());

const connectToDB = require("./dbConnect");
const auth0config = {
  authRequired: false,
  auth0Logout: true,
  issuerBaseURL: "https://psychedevs.eu.auth0.com",
  baseURL: "https://localhost:5000",
  secret: process.env.RANDOM_AUTH0_STRING,
  clientSecret: process.env.AUTH0_SECRET,
  clientID: "do5IMk9C19lzZCyvsl4Ltr0bX2iFUeYF",
  authorizationParams: {
    response_type: "code id_token",
    scope: "openid profile email",
  },
};

const session = require("express-session");

app.use(
  session({
    secret: process.env.RANDOM_AUTH0_STRING,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "Lax",
      secure: true, // this should be set to true for secure (HTTPS) sites
    },
  })
);

app.use(auth(auth0config));
const vasRouter = require("./controllers/logs");
const logsRouter = require("./controllers/logTypes");
const ouraRouter = require("./controllers/oura");

app.use("/uploads", express.static("uploads"));

app.use("/vas", vasRouter());
app.use("/logs", logsRouter);
app.use("/oura", ouraRouter());

app.get("/", (req, res, next) => {
  console.log("In server /", req.oidc.user);
  const isAuthenticated = req.oidc.isAuthenticated();
  console.log("In server /, isAuthenticated:", isAuthenticated);

  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

app.use((req, res, next) => {
  console.log("Cookies: ", req.cookies);
  console.log("Session ID: ", req.sessionID);
  console.log("Session: ", req.session);
  next();
});

const authRouter = require("./controllers/auth");
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

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "certs", "localhost.key")),
    cert: fs.readFileSync(path.join(__dirname, "certs", "localhost.crt")),
  },
  app
);

sslServer.listen(PORT, () => console.log(`Server listening on ${PORT}`));
