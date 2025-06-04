import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  price: { type: Number, required: true }, // ← THÊM DÒNG NÀY
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  description: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });
const Product = mongoose.model("Product", productSchema);
export default Product;
