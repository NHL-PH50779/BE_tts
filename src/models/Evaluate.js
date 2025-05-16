import mongoose from "mongoose";

const evaluateSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  content: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  star: { type: Number, required: true },
}, { timestamps: true });

const Evaluate = mongoose.model("Evaluate", evaluateSchema);
export default Evaluate;
