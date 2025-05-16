import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  phone: String,
  avatar: String,
  password: String,
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  is_active: { type: Boolean, default: true },
  date_of_birth: Date,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
