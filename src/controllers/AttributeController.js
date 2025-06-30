import Attribute from "../models/Attribute.js";

// Lấy danh sách thuộc tính (có pagination và tìm kiếm)
export const getAttributes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    if (page < 1 || limit < 1) {
      const error = new Error("Page và limit phải là số dương");
      error.statusCode = 400;
      throw error;
    }

    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const skip = (page - 1) * limit;
    const total = await Attribute.countDocuments(filter);
    const attributes = await Attribute.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Lấy danh sách thuộc tính thành công",
      data: {
        attributes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy thuộc tính theo ID
export const getAttributeById = async (req, res, next) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      const error = new Error("Không tìm thấy thuộc tính");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Lấy thuộc tính thành công",
      data: attribute,
    });
  } catch (error) {
    next(error);
  }
};

// Tạo thuộc tính mới
export const createAttribute = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Tên thuộc tính là bắt buộc");

    const existing = await Attribute.findOne({ name });
    if (existing) throw new Error("Thuộc tính đã tồn tại");

    const attribute = await Attribute.create({ name });
    res.status(201).json({
      success: true,
      message: "Tạo thuộc tính thành công",
      data: attribute,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật thuộc tính
export const updateAttribute = async (req, res, next) => {
  try {
    const { name } = req.body;
    const id = req.params.id;

    const attribute = await Attribute.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    if (!attribute) {
      const error = new Error("Không tìm thấy thuộc tính");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      data: attribute,
    });
  } catch (error) {
    next(error);
  }
};

// Xoá vĩnh viễn
export const deleteAttribute = async (req, res, next) => {
  try {
    const deleted = await Attribute.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const error = new Error("Không tìm thấy thuộc tính");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Xoá thuộc tính thành công",
    });
  } catch (error) {
    next(error);
  }
};
