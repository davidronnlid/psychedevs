const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const pass = process.env.ATLAS_PASS;
const uri = `mongodb+srv://daro6551:${pass}@dr-social-media-app.hm6wqbm.mongodb.net/?retryWrites=true&w=majority&ssl=true`;

const connectToDB = async () => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

module.exports = connectToDB;
