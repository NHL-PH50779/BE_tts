import Comment from "../models/Comment.js";
import Order from "../models/order.js";
import OrderDetail from "../models/OrderDetail.js";

export const createComment = async (req, res, next) => {
  try {
    const { product_id, order_id, rating, comment } = req.body;
    const user_id = req.user.userId;

    // ✅ Kiểm tra đơn hàng thuộc về người dùng và đã giao chưa
    const order = await Order.findOne({ _id: order_id, user_id });
    if (!order || order.status.toLowerCase() !== "đã giao") {
      return res.status(403).json({ success: false, message: "Bạn chưa thể bình luận sản phẩm này" });
    }

    // ✅ Lấy tất cả order details
    const orderDetails = await OrderDetail.find({ order_id });

    // ✅ Kiểm tra có variant nào thuộc về product này không
    let isPurchased = false;

    for (const detail of orderDetails) {
      const variant = await Variant.findById(detail.variant_id);
      if (variant && variant.product_id.toString() === product_id) {
        isPurchased = true;
        break;
      }
    }

    if (!isPurchased) {
      return res.status(403).json({ success: false, message: "Sản phẩm không thuộc đơn hàng này" });
    }

    // ✅ Tạo bình luận
    const newComment = await Comment.create({
      user_id,
      product_id,
      order_id,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Đã gửi đánh giá",
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};
export const getCommentsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ product_id: productId }).populate("user_id", "name avatar");

    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

// Xoá bình luận
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ success: false, message: "Không tìm thấy bình luận" });

    if (comment.user_id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền xoá bình luận này" });
    }

    await comment.deleteOne();

    res.json({ success: true, message: "Xoá bình luận thành công" });
  } catch (err) {
    next(err);
  }
};