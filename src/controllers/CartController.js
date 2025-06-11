import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user.userId;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(product_id).populate('brand_id category_id');
    if (!product) {
      const error = new Error("Sản phẩm không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    if (!product.is_active) {
      const error = new Error("Sản phẩm không còn kinh doanh");
      error.statusCode = 400;
      throw error;
    }

    // Tìm hoặc tạo giỏ hàng cho user
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = new Cart({ user_id: userId, items: [] });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id
    );

    if (existingItemIndex > -1) {
      // Cập nhật số lượng nếu sản phẩm đã có
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới vào giỏ hàng
      cart.items.push({
        product_id: product._id,
        quantity,
        price: product.price || 0 // Nếu chưa có price trong Product model
      });
    }

    await cart.save();

    // Populate thông tin sản phẩm để trả về
    await cart.populate({
      path: 'items.product_id',
      populate: {
        path: 'brand_id category_id'
      }
    });

    res.success(cart, "Thêm sản phẩm vào giỏ hàng thành công");
  } catch (error) {
    next(error);
  }
};

// Lấy giỏ hàng của user
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user_id: userId, is_active: true })
      .populate({
        path: 'items.product_id',
        populate: {
          path: 'brand_id category_id'
        }
      });

    if (!cart) {
      return res.success({ items: [], total_amount: 0, total_items: 0 }, "Giỏ hàng trống");
    }

    // Lọc bỏ các sản phẩm không còn tồn tại hoặc không active
    const validItems = cart.items.filter(item => 
      item.product_id && item.product_id.is_active
    );

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.success(cart, "Lấy giỏ hàng thành công");
  } catch (error) {
    next(error);
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.userId;

    if (quantity < 1) {
      const error = new Error("Số lượng phải lớn hơn 0");
      error.statusCode = 400;
      throw error;
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      const error = new Error("Giỏ hàng không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    const itemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id
    );

    if (itemIndex === -1) {
      const error = new Error("Sản phẩm không có trong giỏ hàng");
      error.statusCode = 404;
      throw error;
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: 'items.product_id',
      populate: {
        path: 'brand_id category_id'
      }
    });

    res.success(cart, "Cập nhật số lượng thành công");
  } catch (error) {
    next(error);
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      const error = new Error("Giỏ hàng không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    const itemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id
    );

    if (itemIndex === -1) {
      const error = new Error("Sản phẩm không có trong giỏ hàng");
      error.statusCode = 404;
      throw error;
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    await cart.populate({
      path: 'items.product_id',
      populate: {
        path: 'brand_id category_id'
      }
    });

    res.success(cart, "Xóa sản phẩm khỏi giỏ hàng thành công");
  } catch (error) {
    next(error);
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      const error = new Error("Giỏ hàng không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    cart.items = [];
    cart.total_amount = 0;
    cart.total_items = 0;
    await cart.save();

    res.success(cart, "Xóa toàn bộ giỏ hàng thành công");
  } catch (error) {
    next(error);
  }
};

// Lấy số lượng items trong giỏ hàng
export const getCartCount = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user_id: userId, is_active: true });
    const count = cart ? cart.total_items : 0;

    res.success({ count }, "Lấy số lượng giỏ hàng thành công");
  } catch (error) {
    next(error);
  }
};