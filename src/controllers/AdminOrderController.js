import Order from "../models/order.js";
import OrderDetail from "../models/OrderDetail.js";

// GET /api/admin/orders - Lấy tất cả đơn hàng
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user_id", "name email");

    res.status(200).json({
      success: true,
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders/:id - Lấy chi tiết đơn hàng
export const getOrderDetailById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("user_id", "name email");
    if (!order) {
      const error = new Error("Không tìm thấy đơn hàng");
      error.statusCode = 404;
      throw error;
    }

    const items = await OrderDetail.find({ order_id: id }).populate("variant_id");

    res.status(200).json({
      success: true,
      message: "Lấy chi tiết đơn hàng thành công",
      data: {
        ...order.toObject(),
        items,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/orders/:id/status - Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
const validStatuses = ["chờ xác nhận", "đang chuẩn bị hàng", "đang giao", "đã giao", "đã huỷ"];

    if (!validStatuses.includes(status)) {
      const error = new Error("Trạng thái không hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = new Error("Không tìm thấy đơn hàng");
      error.statusCode = 404;
      throw error;
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
