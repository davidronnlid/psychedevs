const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = ({ client }) => {
  const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    password: String,
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  });

  const database = client.db("app_users");
  const user_account_data_collection = database.collection("user_account_data");

  const User = mongoose.model("User", userSchema, user_account_data_collection);

  const addFollower = async (userId, followerId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      const follower = await User.findById(followerId);
      if (!follower) {
        throw new Error(`Follower with id ${followerId} not found`);
      }

      user.followers.push(follower);
      await user.save();

      console.log(`Added follower ${followerId} to user ${userId}`);
    } catch (error) {
      console.error(error);
    }
  };
};
