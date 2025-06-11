import { Router } from "express";
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  softDeleteBrand,
  restoreBrand,
} from "../controllers/BrandController.js";

const brandRouter = Router();

// Lấy tất cả thương hiệu
brandRouter.get("/", getBrands);

// Tạo thương hiệu mới
brandRouter.post("/", createBrand);

// Lấy thương hiệu theo id
brandRouter.get("/:id", getBrandById);

// Cập nhật thương hiệu
brandRouter.patch("/:id", updateBrand);

// Xóa vĩnh viễn thương hiệu
brandRouter.delete("/:id", deleteBrand);

// Xóa mềm thương hiệu
brandRouter.patch("/deactivate/:id", softDeleteBrand);

// Khôi phục thương hiệu
brandRouter.patch("/restore/:id", restoreBrand);

export default brandRouter;