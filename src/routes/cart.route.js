import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} from "../controllers/CartController.js";

const cartRouter = Router();

// Tất cả routes đều cần authentication
cartRouter.use(authenticate);

// GET /api/cart - Lấy giỏ hàng của user
cartRouter.get("/",authenticate, getCart);

// GET /api/cart/count - Lấy số lượng items trong giỏ hàng
cartRouter.get("/count", getCartCount);

// POST /api/cart/add - Thêm sản phẩm vào giỏ hàng
cartRouter.post("/add",authenticate, addToCart);

// PUT /api/cart/update - Cập nhật số lượng sản phẩm
cartRouter.put("/update", updateCartItem);

// DELETE /api/cart/remove/:product_id - Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete("/remove/:product_id", removeFromCart);

// DELETE /api/cart/clear - Xóa toàn bộ giỏ hàng
cartRouter.delete("/clear", clearCart);

export default cartRouter;