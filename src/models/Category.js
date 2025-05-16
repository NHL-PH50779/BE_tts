import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  description: { type: String, required: true },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
