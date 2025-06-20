import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true },
    email: { type: String, required: true },
    name: String,
    bio: String,
    bookmarkedIds: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
