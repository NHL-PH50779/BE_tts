import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
  type: String,
  enum: ["chờ xác nhận", "đang chuẩn bị hàng", "đang giao", "đã giao", "đã huỷ"],
  default: "chờ xác nhận",
},
  shipping_method: {
    type: String,
    enum: ["giao hàng thông thường", "giao hàng hỏa tốc"],
    required: true,
  },
  shipping_address: {
    type: String,
    required: true,
    trim: true,
  },
  payment_method: {
    type: String,
    enum: ["cod", "banking"],
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
  note: {
    type: String,
    trim: true,
  },
  is_paid: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: "orders"
});

export default mongoose.model("Order", orderSchema);
