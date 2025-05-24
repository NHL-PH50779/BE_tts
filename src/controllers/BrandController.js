import Brand from "../models/Brand.js";

// Lấy tất cả thương hiệu, hỗ trợ pagination, search, và includeDeleted
export const getBrands = async (req, res, next) => {
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
      // Kiểm tra xem có text index không
      let useTextSearch = true;
      try {
        await Brand.findOne({ $text: { $search: search } }).limit(1).exec();
      } catch (error) {
        if (error.message.includes("text index required")) {
          useTextSearch = false;
        } else {
          throw error;
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
    const total = await Brand.countDocuments(filter);
    const brands = await Brand.find(filter)
      .skip(skip)
      .limit(limit);

    // Kiểm tra kết quả tìm kiếm
    if (search && total === 0) {
      res.success(
        {
          brands: [],
          pagination: { page, limit, total, totalPages: 0 },
        },
        "Không tìm thấy thương hiệu phù hợp"
      );
      return;
    }

    // Trả về dữ liệu với metadata
    res.success(
      {
        brands,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Lấy danh sách thương hiệu thành công"
    );
  } catch (error) {
    next(error);
  }
};

// Lấy thương hiệu theo id
export const getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      const error = new Error("Thương hiệu không tồn tại");
      error.statusCode = 404;
      throw error;
    }
    res.success(brand, "Lấy thương hiệu thành công");
  } catch (error) {
    next(error);
  }
};

// Tạo thương hiệu mới
export const createBrand = async (req, res, next) => {
  try {
    const newBrand = new Brand(req.body);
    const savedBrand = await newBrand.save();
    res.status(201).success(savedBrand, "Tạo thương hiệu thành công");
  } catch (error) {
    next(error);
  }
};

// Cập nhật thương hiệu theo id
export const updateBrand = async (req, res, next) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBrand) {
      const error = new Error("Thương hiệu không tồn tại");
      error.statusCode = 404;
      throw error;
    }
    res.success(updatedBrand, "Cập nhật thương hiệu thành công");
  } catch (error) {
    next(error);
  }
};

// Xóa thương hiệu vĩnh viễn
export const deleteBrand = async (req, res, next) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      const error = new Error("Thương hiệu không tồn tại");
      error.statusCode = 404;
      throw error;
    }
    res.success(null, "Xóa thương hiệu thành công");
  } catch (error) {
    next(error);
  }
};

// Xóa mềm thương hiệu (is_active = false)
export const softDeleteBrand = async (req, res, next) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );
    if (!updatedBrand) {
      const error = new Error("Thương hiệu không tồn tại");
      error.statusCode = 404;
      throw error;
    }
    res.success(updatedBrand, "Xóa mềm thương hiệu thành công");
  } catch (error) {
    next(error);
  }
};

// Khôi phục thương hiệu
export const restoreBrand = async (req, res, next) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { is_active: true },
      { new: true }
    );
    if (!updatedBrand) {
      const error = new Error("Thương hiệu không tồn tại");
      error.statusCode = 404;
      throw error;
    }
    res.success(updatedBrand, "Khôi phục thương hiệu thành công");
  } catch (error) {
    next(error);
  }
};