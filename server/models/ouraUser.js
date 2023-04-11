const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ouraSchema = new Schema({
  accessToken: String,
  refreshToken: String,
  PD_user_id: ObjectId,
});

module.exports = mongoose.model("OuraUser", ouraSchema, "oura_users");
