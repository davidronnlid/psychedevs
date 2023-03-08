const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");

const User = require("./models/user");

const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

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

const uri = `mongodb+srv://daro6551:${pass}@dr-social-media-app.hm6wqbm.mongodb.net/?retryWrites=true&w=majority&ssl=true`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const mongoose = require("mongoose");

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(user) {
  try {
    const database = client.db("app_users");
    const users = database.collection("user_account_data");
    const query = { username: "David" };
    const foundUser = await users.findOne(query);

    if (user) {
      console.log("Running with user" + user);
      database.users.save(user);
    }

    app.get("/expressed_backend", (req, res) => {
      console.log("hey", foundUser);

      res.json({ express: foundUser });
    });

    console.log(foundUser);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

// Define a route to handle user registration
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Generate a salt value
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt value
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword);

    // Save the hashed password to the database
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    run(user);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Define a route to handle user login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user in the database by username
    const user = await User.findOne({ username });
    // Compare the password entered by the user with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
