// models/userModel.js
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

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
  profile_pic: {
    filename: String,
    contentType: String,
    image: Buffer,
  },
  _id: {
    type: ObjectId,
    required: true,
  },
});

const User = mongoose.model("User", userSchema, "user_account_data");

module.exports = User;
