const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

const authRouter = require("./controllers/auth");
const vasRouter = require("./controllers/logs");

require("dotenv").config();

app.get("/express_backend", (req, res) => {
  res.json({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

const pass = process.env.ATLAS_PASS;
const uri = `mongodb+srv://daro6551:${pass}@dr-social-media-app.hm6wqbm.mongodb.net/?retryWrites=true&w=majority&ssl=true`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    app.use("/auth", authRouter({ client }));
    app.use("/vas", vasRouter({ client }));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Export the client object
module.exports = client;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
