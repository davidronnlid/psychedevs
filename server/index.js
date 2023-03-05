const express = require("express");
// const path = require("path");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = process.env.PORT || 5000;
app.use(cors());
require("dotenv").config();

// app.use(express.static(path.resolve(__dirname, "../client/build")));
// All other GET requests not handled before will return our React app

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });

app.get("/express_backend", (req, res) => {
  res.json({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

const pass = process.env.ATLAS;
console.log(pass);

const uri = `mongodb+srv://daro6551:${pass}@dr-social-media-app.hm6wqbm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("sample_airbnb");
    const listingsAndReviews = database.collection("listingsAndReviews");
    // Query for a listingsAndReview that has the title 'Back to the Future'
    const query = { _id: "10006546" };
    const listingsAndReview = await listingsAndReviews.findOne(query);
    console.log(listingsAndReview);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
