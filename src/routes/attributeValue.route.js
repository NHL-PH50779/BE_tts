import { Router } from "express";
import {
  getAttributeValues,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue
} from "../controllers/AttributeValueController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAttributeValues); // Công khai

// ⛔️ Các route sau chỉ admin mới được phép
router.post("/", authenticate, isAdmin, createAttributeValue);
router.patch("/:id", authenticate, isAdmin, updateAttributeValue);
router.delete("/:id", authenticate, isAdmin, deleteAttributeValue);

export default router;
