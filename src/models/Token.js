import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID là bắt buộc"],
  },
  access_token: {
    type: String,
    required: [true, "Access token là bắt buộc"],
  },
  refresh_token: {
    type: String,
    required: [true, "Refresh token là bắt buộc"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Token", tokenSchema);