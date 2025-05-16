// controllers/CartController.js
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const ProductVariant = require('../models/ProductVariant');

module.exports = {
  getCart: async (req, res) => {
    const userId = req.user.id;

    try {
      let cart = await Cart.findOne({
        where: { user_id: userId },
        include: {
          model: CartItem,
          as: 'items',
          include: {
            model: ProductVariant,
            as: 'variant'
          }
        }
      });

      if (!cart) {
        cart = await Cart.create({ user_id: userId });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Lỗi lấy giỏ hàng.' });
    }
  },

  addItem: async (req, res) => {
    const userId = req.user.id;
    const { product_variant_id, quantity } = req.body;

    try {
      let cart = await Cart.findOne({ where: { user_id: userId } });

      if (!cart) {
        cart = await Cart.create({ user_id: userId });
      }

      let item = await CartItem.findOne({
        where: {
          cart_id: cart.id,
          product_variant_id
        }
      });

      if (item) {
        item.quantity += quantity;
        await item.save();
      } else {
        await CartItem.create({
          cart_id: cart.id,
          product_variant_id,
          quantity
        });
      }

      res.json({ message: 'Đã thêm vào giỏ hàng' });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi thêm sản phẩm vào giỏ hàng.' });
    }
  },

  removeItem: async (req, res) => {
    const userId = req.user.id;
    const { product_variant_id } = req.params;

    try {
      const cart = await Cart.findOne({ where: { user_id: userId } });

      if (!cart) return res.status(404).json({ error: 'Giỏ hàng không tồn tại.' });

      await CartItem.destroy({
        where: {
          cart_id: cart.id,
          product_variant_id
        }
      });

      res.json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi xoá sản phẩm.' });
    }
  }
};
