import AttributeValue from "../models/AttributeValue.js";
import Attribute from "../models/Attribute.js";

// Lấy danh sách value theo thuộc tính
export const getAttributeValues = async (req, res, next) => {
  try {
    const { attributeId } = req.query;

    const filter = {};
    if (attributeId) {
      filter.attribute_id = attributeId;
    }

    const values = await AttributeValue.find(filter)
      .populate("attribute_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách giá trị thuộc tính thành công",
      data: values,
    });
  } catch (error) {
    next(error);
  }
};

// Thêm mới giá trị thuộc tính
export const createAttributeValue = async (req, res, next) => {
  try {
    const { value, attribute_id } = req.body;

    if (!value || !attribute_id) {
      throw new Error("Thiếu value hoặc attribute_id");
    }

    const attribute = await Attribute.findById(attribute_id);
    if (!attribute) {
      const error = new Error("Không tìm thấy thuộc tính cha");
      error.statusCode = 404;
      throw error;
    }

    const newValue = await AttributeValue.create({ value, attribute_id });

    res.status(201).json({
      success: true,
      message: "Tạo giá trị thuộc tính thành công",
      data: newValue,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật
export const updateAttributeValue = async (req, res, next) => {
  try {
    const { value } = req.body;
    const { id } = req.params;

    const updated = await AttributeValue.findByIdAndUpdate(
      id,
      { value },
      { new: true, runValidators: true }
    );

    if (!updated) {
      const error = new Error("Không tìm thấy giá trị thuộc tính");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Xoá vĩnh viễn
export const deleteAttributeValue = async (req, res, next) => {
  try {
    const deleted = await AttributeValue.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const error = new Error("Không tìm thấy giá trị thuộc tính");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Đã xoá thành công",
    });
  } catch (error) {
    next(error);
  }
};
