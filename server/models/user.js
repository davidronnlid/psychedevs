// models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema, "user_account_data");

module.exports = User;
