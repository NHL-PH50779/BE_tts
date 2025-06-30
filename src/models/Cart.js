import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant", // ✅ Ref chính xác
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  is_active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
