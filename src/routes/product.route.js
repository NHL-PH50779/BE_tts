import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  restoreProduct,
} from "../controllers/ProductController.js";

const productRouter = Router();

// Lấy tất cả sản phẩm, có thể dùng query ?includeDeleted=true để lấy cả sản phẩm đã soft-delete
productRouter.get("/", getProducts);

// Tạo sản phẩm mới
productRouter.post("/", createProduct);

// Lấy sản phẩm theo id
productRouter.get("/:id", getProductById);

// Cập nhật sản phẩm theo id
productRouter.patch("/:id", updateProduct);

// Xóa sản phẩm vĩnh viễn
productRouter.delete("/:id", deleteProduct);

// Xóa mềm (soft-delete) sản phẩm
productRouter.patch("/deactivate/:id", softDeleteProduct);

// Khôi phục sản phẩm đã soft-delete
productRouter.patch("/restore/:id", restoreProduct);

export default productRouter;