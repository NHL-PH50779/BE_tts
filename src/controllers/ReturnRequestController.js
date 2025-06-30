import Order from "../models/order.js";
import ReturnRequest from "../models/ReturnRequest.js";
import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";

// Người dùng yêu cầu trả hàng
export const requestReturn = async (req, res, next) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, user_id: userId });
    if (!order) throw new Error("Không tìm thấy đơn hàng");
    if (order.status !== "đã giao") throw new Error("Chỉ đơn hàng đã giao mới được trả");

    const exist = await ReturnRequest.findOne({ order_id: orderId });
    if (exist) throw new Error("Đơn hàng này đã gửi yêu cầu trả");

    const refundAmount = order.total_price;

    const returnReq = await ReturnRequest.create({
      order_id: orderId,
      user_id: userId,
      reason,
      refund_amount: refundAmount,
      status: "chờ xử lý" // ✅ trạng thái tiếng Việt
    });

    res.json({ success: true, message: "Gửi yêu cầu trả hàng thành công", data: returnReq });
  } catch (err) {
    next(err);
  }
};

// Admin duyệt hoàn tiền
export const approveReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const returnReq = await ReturnRequest.findById(id).populate("user_id");

    if (!returnReq || returnReq.status !== "chờ xử lý")
      throw new Error("Yêu cầu không hợp lệ");

    const wallet = await Wallet.findOne({ user_id: returnReq.user_id._id });
    wallet.balance += returnReq.refund_amount;
    await wallet.save();

    await WalletTransaction.create({
      wallet_id: wallet._id,
      amount: returnReq.refund_amount,
      type: "refund",
      description: `Hoàn tiền đơn hàng ${returnReq.order_id}`
    });

    returnReq.status = "đã chấp nhận";
    await returnReq.save();

    res.json({ success: true, message: "Đã duyệt hoàn tiền", data: returnReq });
  } catch (err) {
    next(err);
  }
};

// Admin từ chối hoàn tiền
export const rejectReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const returnReq = await ReturnRequest.findById(id);
    if (!returnReq || returnReq.status !== "chờ xử lý")
      throw new Error("Yêu cầu không hợp lệ");

    returnReq.status = "đã từ chối";
    await returnReq.save();

    res.json({ success: true, message: "Đã từ chối yêu cầu trả hàng" });
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách yêu cầu trả hàng (admin)
export const getAllReturnRequests = async (req, res, next) => {
  try {
    const returns = await ReturnRequest.find()
      .populate("order_id")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Lấy danh sách yêu cầu trả hàng thành công",
      data: returns,
    });
  } catch (error) {
    next(error);
  }
};
