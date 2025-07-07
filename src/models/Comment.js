import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true },
  is_active: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: "comments"
});

export default mongoose.model("Comment", commentSchema);
