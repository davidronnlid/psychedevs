const mongoose = require("mongoose");
require("dotenv").config();

const pass = process.env.ATLAS_PASS;

const uri = `mongodb+srv://daro6551:${pass}@dr-social-media-app.hm6wqbm.mongodb.net/app_users?retryWrites=true&w=majority&ssl=true`;

const connectToDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      server: { auto_reconnect: true },
    });
    console.log("Connected to MongoDB using Mongoose!");
  } catch (err) {
    console.error("Error connecting to MongoDB using Mongoose", err);
  }
};

module.exports = connectToDB;
