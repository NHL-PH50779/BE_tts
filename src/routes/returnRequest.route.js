import { Router } from "express";
import {
  requestReturn,
  approveReturn,
  rejectReturn,
  getAllReturnRequests, // ✅ thêm controller mới
} from "../controllers/ReturnRequestController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const returnRequestRouter = Router();

// Người dùng gửi yêu cầu trả hàng
returnRequestRouter.post("/", authenticate, requestReturn);

// Admin xem danh sách yêu cầu trả hàng
returnRequestRouter.get("/", authenticate, isAdmin, getAllReturnRequests);

// Admin duyệt hoặc từ chối yêu cầu
returnRequestRouter.patch("/:id/approve", authenticate, isAdmin, approveReturn);
returnRequestRouter.patch("/:id/reject", authenticate, isAdmin, rejectReturn);

export default returnRequestRouter;
