import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
  product_variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Variant", required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true });

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
