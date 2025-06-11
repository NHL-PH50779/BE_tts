import express from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  restoreProduct,
} from "../controllers/ProductController.js";


const router = express.Router();

// Không yêu cầu auth để xem danh sách hoặc chi tiết sản phẩm
router.get("/", getProducts);
router.get("/:id", getProductById);

// Yêu cầu auth và quyền admin để tạo/sửa/xóa
router.post("/", authenticate, isAdmin, createProduct);
router.patch("/:id", authenticate, isAdmin, updateProduct);
router.delete("/:id", authenticate, isAdmin, deleteProduct);
router.patch("/:id/soft-delete", authenticate, isAdmin, softDeleteProduct);
router.patch("/:id/restore", authenticate, isAdmin, restoreProduct);

export default router;