import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  checkoutOrder,
  getOrdersByUser,
  getOrderById,
  cancelOrder,
  confirmOrder
} from "../controllers/OrderController.js";

const orderRouter = Router();

// ✅ Tất cả routes yêu cầu đăng nhập
orderRouter.use(authenticate);

// POST /api/orders - Đặt hàng (checkout)
orderRouter.post("/", checkoutOrder);

// GET /api/orders - Lấy danh sách đơn hàng của người dùng
orderRouter.get("/", getOrdersByUser);

// GET /api/orders/:id - Lấy chi tiết đơn hàng theo ID
orderRouter.get("/:id", getOrderById);

// PATCH /api/orders/:id/cancel - Huỷ đơn hàng
orderRouter.patch("/:id/cancel", cancelOrder);

// PATCH /api/orders/:id/confirm - Xác nhận đã nhận hàng
orderRouter.patch("/:id/confirm", confirmOrder);

export default orderRouter;
