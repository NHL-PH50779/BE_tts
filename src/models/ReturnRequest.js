import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  refund_amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["chờ xử lý", "đã chấp nhận", "đã từ chối"],
    default: "chờ xử lý"
  }
}, {
  timestamps: true,
  collection: "return_requests"
});

export default mongoose.model("ReturnRequest", returnRequestSchema);
