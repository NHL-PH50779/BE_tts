import Product from "../models/Product.js";

// Lấy tất cả sản phẩm, có thể lọc theo is_active (mặc định lấy sản phẩm active)
export const getProducts = async (req, res) => {
  try {
    // Nếu có query includeDeleted=true thì lấy tất cả sản phẩm, không thì chỉ lấy is_active=true
    const includeDeleted = req.query.includeDeleted === "true";
    const filter = includeDeleted ? {} : { is_active: true };

    const products = await Product.find(filter)
      .populate("brand_id", "name")  // populate brand chỉ lấy trường name
      .populate("category_id", "name"); // populate category chỉ lấy trường name

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy sản phẩm theo id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand_id", "name")
      .populate("category_id", "name");

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm theo id
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm vĩnh viễn
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa mềm (soft delete) - đánh dấu is_active = false
export const softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product soft deleted", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Khôi phục sản phẩm đã xóa mềm
export const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { is_active: true },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product restored", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
