import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  wallet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true },
  type: { type: String, enum: ["refund", "topup", "withdraw"], required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["success", "failed"], default: "success" },
  description: { type: String }
}, { timestamps: true, collection: "wallet_transactions" });

export default mongoose.model("WalletTransaction", walletTransactionSchema);
