import Variant from "../models/Variant.js";
import Product from "../models/Product.js";

// Lấy tất cả biến thể, hỗ trợ pagination, search, và includeDeleted
export const getVariants = async (req, res, next) => {
  try {
    // Check query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const includeDeleted = req.query.includeDeleted;
    const productId = req.query.productId; // Optional filter by product

    if (page < 1 || limit < 1) {
      const error = new Error("Page và limit phải là số dương");
      error.statusCode = 400;
      throw error;
    }
    if (search.length > 100) {
      const error = new Error("Chuỗi tìm kiếm quá dài");
      error.statusCode = 400;
      throw error;
    }
    if (includeDeleted && !["true", "false"].includes(includeDeleted)) {
      const error = new Error("includeDeleted phải là 'true' hoặc 'false'");
      error.statusCode = 400;
      throw error;
    }

    // Xây dựng bộ lọc
    const filter = includeDeleted === "true" ? {} : { is_active: true };
    if (productId) {
      filter.product_id = productId;
    } 
    if (search) {
      filter.$or = [
        { sku: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Variant.countDocuments(filter);
    const variants = await Variant.find(filter)
      .populate("product_id", "name")
      .skip(skip)
      .limit(limit);

    // Kiểm tra kết quả tìm kiếm
    if (search && total === 0) {
      res.success(
        {
          variants: [],
          pagination: { page, limit, total, totalPages: 0 },
        },
        "Không tìm thấy biến thể phù hợp"
      );
      return;
    }

    // Trả về dữ liệu với metadata
    res.success(
      {
        variants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Lấy danh sách biến thể thành công"
    );
  } catch (error) {
    next(error);
  }
};

// Lấy biến thể theo id
export const getVariantById = async (req, res, next) => {
  try {
    const variant = await Variant.findById(req.params.id)
      .populate("product_id", "name");

    if (!variant) {
      const error = new Error("Biến thể không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(variant, "Lấy biến thể thành công");
  } catch (error) {
    next(error);
  }
};

// Tạo biến thể mới
export const createVariant = async (req, res, next) => {
  try {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(req.body.product_id);
    if (!product) {
      const error = new Error("Sản phẩm không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    const newVariant = new Variant(req.body);
    const savedVariant = await newVariant.save();
    res.status(201).success(savedVariant, "Tạo biến thể thành công");
  } catch (error) {
    next(error);
  }
};

// Cập nhật biến thể theo id
export const updateVariant = async (req, res, next) => {
  try {
    // Kiểm tra sản phẩm nếu product_id được cập nhật
    if (req.body.product_id) {
      const product = await Product.findById(req.body.product_id);
      if (!product) {
        const error = new Error("Sản phẩm không tồn tại");
        error.statusCode = 404;
        throw error;
      }
    }

    const updatedVariant = await Variant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVariant) {
      const error = new Error("Biến thể không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(updatedVariant, "Cập nhật biến thể thành công");
  } catch (error) {
    next(error);
  }
};

// Xóa biến thể vĩnh viễn
export const deleteVariant = async (req, res, next) => {
  try {
    const deletedVariant = await Variant.findByIdAndDelete(req.params.id);

    if (!deletedVariant) {
      const error = new Error("Biến thể không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(null, "Xóa biến thể thành công");
  } catch (error) {
    next(error);
  }
};

// Xóa mềm biến thể (is_active = false)
export const softDeleteVariant = async (req, res, next) => {
  try {
    const variant = await Variant.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );

    if (!variant) {
      const error = new Error("Biến thể không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(variant, "Xóa mềm biến thể thành công");
  } catch (error) {
    next(error);
  }
};

// Khôi phục biến thể
export const restoreVariant = async (req, res, next) => {
  try {
    const variant = await Variant.findByIdAndUpdate(
      req.params.id,
      { is_active: true },
      { new: true }
    );

    if (!variant) {
      const error = new Error("Biến thể không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(variant, "Khôi phục biến thể thành công");
  } catch (error) {
    next(error);
  }
};