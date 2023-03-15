const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

const authRouter = require("./controllers/auth");
const vasRouter = require("./controllers/logs");
const usersRouter = require("./controllers/users");

const connectToDB = require("./dbConnect");

app.get("/express_backend", (req, res) => {
  res.json({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

(async () => {
  const client = await connectToDB();
  app.use("/auth", authRouter({ client }));
  app.use("/vas", vasRouter({ client }));
  app.use("/users", usersRouter({ client }));
})();

const path = require("path");

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../client/build")));

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
