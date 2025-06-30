import express from "express";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";
import  upload  from "../middlewares/upload.js";


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

// ✅ Yêu cầu auth + admin + upload ảnh
router.post("/", authenticate, isAdmin, upload.single("image"), createProduct);
router.patch("/:id", authenticate, isAdmin, upload.single("image"), updateProduct);

// ✅ Xoá & khôi phục sản phẩm
router.delete("/:id", authenticate, isAdmin, deleteProduct);
router.patch("/:id/soft-delete", authenticate, isAdmin, softDeleteProduct);
router.patch("/:id/restore", authenticate, isAdmin, restoreProduct);

export default router;
