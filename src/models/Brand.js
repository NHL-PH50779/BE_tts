import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  logo: String,
  description: String,
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
