const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// Define the user schema
const logsSchema = new mongoose.Schema({
  _id: {
    type: ObjectId,
    required: true,
  },
  logs: {
    type: Array,
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },
});

// Define the User model
const Logs = mongoose.model("vas_mood_logs", logsSchema);

module.exports = Logs;
