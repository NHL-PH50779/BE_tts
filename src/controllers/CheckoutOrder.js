
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

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ user_id: userId }).populate({
      path: "items.variant_id",
      populate: { path: "product_id" }
    });

    if (!cart || cart.items.length === 0) {
      const error = new Error("Giỏ hàng trống");
      error.statusCode = 400;
      throw error;
    }

    // Kiểm tra sản phẩm và tính tổng tiền
    let total_price = 0;
    const validItems = [];

    for (const item of cart.items) {
      const variant = item.variant_id;

      if (
        !variant ||
        !variant.is_active ||
        !variant.product_id?.is_active
      ) continue;

      if (variant.stock < item.quantity) {
        const error = new Error(`Không đủ hàng cho SKU: ${variant.sku}`);
        error.statusCode = 400;
        throw error;
      }

      // Trừ kho
      variant.stock -= item.quantity;
      await variant.save();

      total_price += variant.price * item.quantity;
      validItems.push(item);
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

    // Tạo chi tiết đơn hàng
    const orderDetailDocs = validItems.map(item => ({
      order_id: order._id,
      variant_id: item.variant_id._id,
      quantity: item.quantity,
      price: item.price
    }));

    await OrderDetail.insertMany(orderDetailDocs);

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

