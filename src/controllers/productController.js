import Product from "../models/Product.js";

// Lấy tất cả sản phẩm, hỗ trợ pagination, search, và includeDeleted
export const getProducts = async (req, res, next) => {
  try {
    // Check query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const includeDeleted = req.query.includeDeleted;

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
    if (search) {
      // Kiểm tra xem có text index không bằng cách thử một truy vấn nhỏ
      let useTextSearch = true;
      try {
        await Product.findOne({ $text: { $search: search } }).limit(1).exec();
      } catch (error) {
        if (error.message.includes("text index required")) {
          useTextSearch = false;
        } else {
          throw error; // Ném lại các lỗi khác
        }
      }

      if (useTextSearch) {
        filter.$text = { $search: search };
      } else {
        filter.name = { $regex: search, $options: "i" };
      }
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("brand_id", "name")
      .populate("category_id", "name")
      .skip(skip)
      .limit(limit);

    // Kiểm tra kết quả tìm kiếm
    if (search && total === 0) {
      res.success(
        {
          products: [],
          pagination: { page, limit, total, totalPages: 0 },
        },
        "Không tìm thấy sản phẩm phù hợp"
      );
      return;
    }

    // Trả về dữ liệu với metadata
    res.success(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Lấy danh sách sản phẩm thành công"
    );
  } catch (error) {
    next(error);
  }
};

// Lấy sản phẩm theo id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand_id", "name")
      .populate("category_id", "name");

    if (!product) {
      const error = new Error("Sản phẩm không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(product, "Lấy sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).success(savedProduct, "Tạo sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

// Cập nhật sản phẩm theo id
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      const error = new Error("Sản phẩm không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(updatedProduct, "Cập nhật sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

// Xóa sản phẩm vĩnh viễn
export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      const error = new Error("Sản phẩm không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(null, "Xóa sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

// Xóa mềm sản phẩm (is_active = false)
export const softDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );

    if (!product) {
      const error = new Error("Sản phẩm không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(product, "Xóa mềm sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};

// Khôi phục sản phẩm
export const restoreProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { is_active: true },
      { new: true }
    );

    if (!product) {
      const error = new Error("Sản phẩm không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    res.success(product, "Khôi phục sản phẩm thành công");
  } catch (error) {
    next(error);
  }
};