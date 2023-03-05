const mongoose = require("mongoose");

const myDataSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
});

const MyData = mongoose.model("MyData", myDataSchema);

module.exports = MyData;
