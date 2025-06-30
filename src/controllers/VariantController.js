import Variant from "../models/Variant.js";
import Product from "../models/Product.js";
import AttributeValue from "../models/AttributeValue.js";
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
    const { product_id, price, stock, sku, name, attribute_value_ids } = req.body;

    // ✅ 1. Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    // ✅ 2. Lấy các AttributeValue và populate attribute_id
    const values = await AttributeValue.find({ _id: { $in: attribute_value_ids } }).populate("attribute_id");
    if (values.length !== attribute_value_ids.length) {
      return res.status(400).json({
        success: false,
        message: "Một hoặc nhiều giá trị thuộc tính không tồn tại",
      });
    }

    // ✅ 3. Kiểm tra không có 2 giá trị cho cùng 1 thuộc tính
    const seenAttributes = new Set();
    for (const val of values) {
      const attrId = val.attribute_id._id.toString();
      if (seenAttributes.has(attrId)) {
        return res.status(400).json({
          success: false,
          message: "Không được chọn nhiều giá trị cho cùng một thuộc tính",
        });
      }
      seenAttributes.add(attrId);
    }

    // ✅ 4. Kiểm tra biến thể trùng tổ hợp
    const existingVariants = await Variant.find({ product_id });

    for (const variant of existingVariants) {
      const existingAttrIds = variant.attributes.map(id => id.toString()).sort();
      const incomingAttrIds = attribute_value_ids.map(id => id.toString()).sort();

      const isDuplicate = JSON.stringify(existingAttrIds) === JSON.stringify(incomingAttrIds);
      if (isDuplicate) {
        return res.status(400).json({
          success: false,
          message: "Biến thể với tổ hợp thuộc tính này đã tồn tại",
        });
      }
    }

    // ✅ 5. Tạo mới
    const newVariant = new Variant({
      product_id,
      price,
      stock,
      sku,
      name,
      attributes: attribute_value_ids,
    });

    const saved = await newVariant.save();
    const populated = await Variant.findById(saved._id)
      .populate("product_id", "name")
      .populate({
        path: "attributes",
        populate: { path: "attribute_id", select: "name" }
      });

    res.status(201).json({
      success: true,
      message: "Tạo biến thể thành công",
      data: populated
    });
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