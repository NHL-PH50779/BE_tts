import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipping", "delivered", "cancelled"],
    default: "pending",
  },
  shipping_method: {
    type: String,
    enum: ["standard", "express"],
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
