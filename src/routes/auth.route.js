import express from "express";
import { register, login, refreshToken } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", (req, res) => {
  // Xử lý đăng xuất, có thể xóa token hoặc làm gì đó khác
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;