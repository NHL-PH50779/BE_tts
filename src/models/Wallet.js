import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  balance: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true, collection: "wallets" });

export default mongoose.model("Wallet", walletSchema);
