import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserActive,
  updateUserRole
} from "../controllers/UserController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const userRouter = Router();

// ✅ Tất cả routes yêu cầu đăng nhập và quyền admin
userRouter.use(authenticate, isAdmin);

// GET /api/users - Lấy danh sách người dùng
userRouter.get("/", getAllUsers);

// GET /api/users/:id - Lấy chi tiết người dùng
userRouter.get("/:id", getUserById);

// PATCH /api/users/:id - Cập nhật thông tin người dùng
userRouter.patch("/:id", updateUser);

// PATCH /api/users/:id/status - Khóa/Mở khóa tài khoản người dùng
userRouter.patch("/:id/status", toggleUserActive);

// PATCH /api/users/:id/role - Cập nhật vai trò người dùng
userRouter.patch("/:id/role", updateUserRole);

export default userRouter;
