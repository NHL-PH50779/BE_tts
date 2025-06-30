import mongoose from "mongoose";

const attributeValueSchema = new mongoose.Schema({
  value: {
    type: String,
    required: [true, "Giá trị thuộc tính là bắt buộc"],
    trim: true,
  },
  attribute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attribute",
    required: [true, "Thuộc tính cha là bắt buộc"],
  },
}, {
  timestamps: true,
});

export default mongoose.model("AttributeValue", attributeValueSchema);
