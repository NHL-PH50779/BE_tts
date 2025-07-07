import express from "express";
import { register, login, refreshToken ,verifyOtp,forgotPassword,resetPassword } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", (req, res) => {
  // Xử lý đăng xuất, có thể xóa token hoặc làm gì đó khác
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;