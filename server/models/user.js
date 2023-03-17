const mongoose = require("mongoose");

// Define the user schema - which will be used in auth.js primarily
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define the User model
const User = mongoose.model("user_account_data", userSchema);

module.exports = User;
