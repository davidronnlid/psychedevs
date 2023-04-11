const mongoose = require("mongoose");
const { Schema } = mongoose;

const logTypeSchema = new Schema({
  _id: ObjectId,
  userId: {
    type: ObjectId,
    required: true,
  },
  logTypes: [
    {
      answer_format: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      logType_id: {
        type: String,
        required: true,
      },
      weekdays: [
        {
          type: Boolean,
          required: true,
        },
      ],
    },
  ],
});

const LogType = mongoose.model("LogType", logTypeSchema, "log_types");

module.exports = LogType;
