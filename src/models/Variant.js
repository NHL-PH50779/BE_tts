import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên biến thể là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên biến thể không được vượt quá 100 ký tự"],
    },
    sku: {
      type: String,
      required: [true, "SKU là bắt buộc"],
      unique: true,
      trim: true,
      maxlength: [50, "SKU không được vượt quá 50 ký tự"],
    },
    price: {
      type: Number,
      required: [true, "Giá là bắt buộc"],
      min: [0, "Giá không được nhỏ hơn 0"],
    },
    stock: {
      type: Number,
      required: [true, "Số lượng tồn kho là bắt buộc"],
      min: [0, "Số lượng tồn kho không được nhỏ hơn 0"],
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "ID sản phẩm là bắt buộc"],
    },
    attributes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
      required: true
    }],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "product_variants",
  }
);

variantSchema.index({ name: "text", sku: "text" });

export default mongoose.model("Variant", variantSchema);
