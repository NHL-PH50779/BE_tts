import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Cart from "../models/Cart.js";
import Wallet from "../models/Wallet.js";
import { sendMail } from "../utils/sendMail.js";
dotenv.config();

export const register = async (req, res, next) => {
  try {
    const { email, password, name, address, phone, avatar, date_of_birth, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email đã được sử dụng");

    let roleDoc = await Role.findOne({ name: role || "user" });
    if (!roleDoc) roleDoc = await Role.create({ name: role || "user" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    const user = new User({
      email,
      password,
      name,
      address,
      phone,
      avatar,
      date_of_birth,
      role_id: roleDoc._id,
      otp,
      otp_expires: otpExpires,
    });

    await user.save();
    await Cart.create({ user_id: user._id });
    await Wallet.create({ user_id: user._id });

    await sendMail({
      to: email,
      subject: "Mã xác thực tài khoản",
      html: `<p>Chào ${name || "bạn"},</p><p>Mã OTP của bạn là <b>${otp}</b>. Có hiệu lực trong 15 phút.</p>`,
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công, vui lòng xác minh OTP trong email",
      data: { userId: user._id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("Không tìm thấy người dùng");
    if (user.is_verified) throw new Error("Tài khoản đã xác minh");
    if (user.otp !== otp) throw new Error("OTP không chính xác");
    if (user.otp_expires < new Date()) throw new Error("OTP đã hết hạn");

    user.is_verified = true;
    user.otp = undefined;
    user.otp_expires = undefined;
    await user.save();

    res.json({ success: true, message: "Xác minh OTP thành công" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, is_active: true }).populate("role_id");
    if (!user) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    // ✅ Ngăn đăng nhập nếu chưa xác minh
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản chưa được xác minh. Vui lòng kiểm tra email để xác minh OTP.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role_id.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role_id.name },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role_id.name,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("Refresh token là bắt buộc");

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Tạo access token mới thành công",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, is_active: true });
    if (!user) return res.status(404).json({ success: false, message: "Email không tồn tại" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.reset_password_otp = otp;
    user.reset_password_expires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const html = `
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
      <p>Mã có hiệu lực trong 15 phút.</p>
    `;

    await sendMail({
      to: email,
      subject: "Đặt lại mật khẩu - Laptop Shop",
      html,
    });

    res.json({ success: true, message: "OTP đã được gửi đến email" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, is_active: true });

    if (!user || user.reset_password_otp !== otp || Date.now() > new Date(user.reset_password_expires)) {
      return res.status(400).json({ success: false, message: "OTP không đúng hoặc đã hết hạn" });
    }

    user.password = newPassword;
    user.reset_password_otp = null;
    user.reset_password_expires = null;
    await user.save();

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    next(err);
  }
};
