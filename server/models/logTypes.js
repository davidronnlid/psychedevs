const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { Schema } = mongoose;

const logTypesSchema = new Schema({
  _id: ObjectId,
  userId: {
    type: String,
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
      unit: {
        type: String,
        required: true,
      },
    },
  ],
});

const LogType = mongoose.model("LogTypes", logTypesSchema, "log_types");

module.exports = LogType;
