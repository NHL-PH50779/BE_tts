import express from "express";
import {
  getVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  softDeleteVariant,
  restoreVariant,
} from "../controllers/VariantController.js";

const router = express.Router();

// Lấy tất cả biến thể (hỗ trợ pagination, search, và includeDeleted)
router.get("/", getVariants);

// Lấy biến thể theo ID
router.get("/:id", getVariantById);

// Tạo biến thể mới
router.post("/", createVariant);

// Cập nhật biến thể theo ID
router.put("/:id", updateVariant);

// Xóa vĩnh viễn biến thể theo ID
router.delete("/:id", deleteVariant);

// Xóa mềm biến thể (is_active = false)
router.patch("/:id/soft-delete", softDeleteVariant);

// Khôi phục biến thể
router.patch("/:id/restore", restoreVariant);

export default router;