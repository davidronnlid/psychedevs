const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  withingsId: { type: String, unique: true },
  accessToken: String,
  refreshToken: String,
});

// Pre-save middleware to log before saving
userSchema.pre("save", function (next) {
  console.log(`Attempting to save user with Withings ID: ${this.withingsId}`);
  next();
});

// Post-save middleware to log success or error
userSchema.post("save", function (doc, next) {
  console.log(`Successfully saved user with Withings ID: ${doc.withingsId}`);
  next();
});

// Error handling middleware for save
userSchema.post("save", function (error, doc, next) {
  if (error) {
    console.error(
      `Error saving user with Withings ID: ${doc.withingsId}`,
      error
    );
  }
  next(error);
});

const WithingsUser = mongoose.model("WithingsUser", userSchema);

module.exports = WithingsUser;
