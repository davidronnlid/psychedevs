const mongoose = require("mongoose");
const { Schema } = mongoose;

const ouraSchema = new Schema({
  ouraId: String,
  accessToken: String,
  refreshToken: String,
});

module.exports = mongoose.model("OuraUser", ouraSchema);
