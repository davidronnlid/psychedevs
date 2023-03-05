const express = require("express");
// const path = require("path");
const cors = require("cors");

const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = process.env.PORT || 5000;
app.use(cors());
require("dotenv").config();
const MyData = require("./models/numMod");

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
    const database = client.db("simple_numbers_to_display");
    const foundNumbers = database.collection("simple_numbers_to_display");
    const query = { number: 23 };
    const foundNumber = await foundNumbers.findOne(query);

    app.get("/expressed_backend", (req, res) => {
      console.log("hey", foundNumber);

      res.json({ express: foundNumber });
    });

    console.log(foundNumber);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
