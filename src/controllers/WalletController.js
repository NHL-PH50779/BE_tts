import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";

// [GET] /api/wallet - Lấy số dư ví của người dùng
export const getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user_id: req.user.userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: "Ví chưa được tạo" });
    }
    res.json({ success: true, data: { balance: wallet.balance } });
  } catch (error) {
    next(error);
  }
};

// [GET] /api/wallet/transactions - Lịch sử giao dịch ví
export const getWalletTransactions = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user_id: req.user.userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: "Ví chưa được tạo" });
    }

    const transactions = await WalletTransaction.find({ wallet_id: wallet._id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};
