import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  total_amount: {
    type: Number,
    default: 0
  },
  total_items: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Tính tổng tiền và số lượng items trước khi lưu
cartSchema.pre('save', function(next) {
  this.total_amount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.total_items = this.items.reduce((total, item) => total + item.quantity, 0);
  next();
});

// Method để tính tổng
cartSchema.methods.calculateTotals = function() {
  this.total_amount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.total_items = this.items.reduce((total, item) => total + item.quantity, 0);
};

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;