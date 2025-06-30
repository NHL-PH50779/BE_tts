import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { checkoutOrder } from "../controllers/OrderController.js";

const checkoutRouter = Router();

// ✅ Tất cả routes yêu cầu đăng nhập
checkoutRouter.use(authenticate);

// POST /api/checkout - Tiến hành đặt hàng
checkoutRouter.post("/", checkoutOrder);

export default checkoutRouter;
