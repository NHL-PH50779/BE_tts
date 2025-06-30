import { Router } from "express";
import {
  getAllOrders,
  getOrderDetailById,
  updateOrderStatus,
} from "../controllers/AdminOrderController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const adminOrderRouter = Router();

// Yêu cầu đăng nhập và là admin cho toàn bộ route
adminOrderRouter.use(authenticate, isAdmin);

adminOrderRouter.get("/", getAllOrders);
adminOrderRouter.get("/:id", getOrderDetailById);
adminOrderRouter.patch("/:id/status", updateOrderStatus);

export default adminOrderRouter;
