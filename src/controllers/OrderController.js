import Order from "../models/order.js";
import OrderDetail from "../models/OrderDetail.js";
import Variant from "../models/Variant.js";
import Cart from "../models/Cart.js";

export const checkoutOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      shipping_method,
      shipping_address,
      payment_method,
      note
    } = req.body;

    // Validate đầu vào
    if (!shipping_method || !shipping_address || !payment_method) {
      const error = new Error("Thiếu thông tin bắt buộc khi đặt hàng");
      error.statusCode = 400;
      throw error;
    }

    const cart = await Cart.findOne({ user_id: userId }).populate({
      path: "items.variant_id",
      populate: { path: "product_id" }
    });

    if (!cart || cart.items.length === 0) {
      const error = new Error("Giỏ hàng trống");
      error.statusCode = 400;
      throw error;
    }

    let total_price = 0;
    const validItems = [];

    for (const item of cart.items) {
      const variant = item.variant_id;

      if (!variant || !variant.is_active || !variant.product_id?.is_active) {
        continue; // Bỏ qua sản phẩm không hợp lệ
      }

      if (variant.stock < item.quantity) {
        const error = new Error(`Không đủ hàng cho SKU: ${variant.sku}`);
        error.statusCode = 400;
        throw error;
      }

      // Trừ kho
      variant.stock -= item.quantity;
      await variant.save();

      total_price += variant.price * item.quantity;

      validItems.push({
        variant_id: variant._id,
        quantity: item.quantity,
        price: variant.price,
      });
    }

    if (validItems.length === 0) {
      const error = new Error("Không có sản phẩm hợp lệ để đặt hàng");
      error.statusCode = 400;
      throw error;
    }

    // Tạo đơn hàng
    const order = await Order.create({
      user_id: userId,
      shipping_method,
      shipping_address,
      payment_method,
      total_price,
      note
    });

    // Lưu vào bảng order_details
    const orderItems = validItems.map(item => ({
      order_id: order._id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price: item.price
    }));

    await OrderDetail.insertMany(orderItems);

    // Xoá giỏ hàng
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ user_id: req.user.userId }).sort({ createdAt: -1 });
    res.success(orders, "Lấy danh sách đơn hàng thành công");
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user.userId });
    if (!order) {
      const error = new Error("Không tìm thấy đơn hàng");
      error.statusCode = 404;
      throw error;
    }

    const items = await OrderDetail.find({ order_id: order._id }).populate("variant_id");
    res.success({ ...order.toObject(), items }, "Lấy chi tiết đơn hàng thành công");
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user.userId });
    if (!order) {
      const error = new Error("Không tìm thấy đơn hàng");
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== "pending") {
      const error = new Error("Chỉ đơn hàng đang chờ xử lý mới được huỷ");
      error.statusCode = 400;
      throw error;
    }

    order.status = "cancelled";
    await order.save();

    res.success(order, "Huỷ đơn hàng thành công");
  } catch (error) {
    next(error);
  }
};

export const confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user.userId });
    if (!order) {
      const error = new Error("Không tìm thấy đơn hàng");
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== "shipping") {
      const error = new Error("Chỉ đơn hàng đang vận chuyển mới được xác nhận");
      error.statusCode = 400;
      throw error;
    }

    order.status = "delivered";
    await order.save();

    res.success(order, "Xác nhận đã nhận hàng thành công");
  } catch (error) {
    next(error);
  }
};
