import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getWalletBalance, getWalletTransactions } from "../controllers/WalletController.js";

const walletRouter = Router();

walletRouter.use(authenticate); // ✅ Phải đăng nhập

walletRouter.get("/", getWalletBalance); // Lấy số dư
walletRouter.get("/transactions", getWalletTransactions); // Lịch sử giao dịch

export default walletRouter;
