const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// Define the user schema
const logsSchema = new mongoose.Schema({
  _id: {
    type: ObjectId,
    required: true,
  },
  logs: {
    type: [
      {
        _id: {
          type: ObjectId,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
        logType_id: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },
});

// Define the User model
const Logs = mongoose.model("vas_mood_logs", logsSchema, "vas_mood_logs");

module.exports = Logs;
