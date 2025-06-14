import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Token from "../models/Token.js";
import Role from "../models/Role.js";

// Đăng ký người dùng
export const register = async (req, res, next) => {
  try {
    const { email, password, name, address, phone, avatar, date_of_birth, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email đã được sử dụng");
      error.statusCode = 400;
      throw error;
    }

    // Tìm hoặc tạo role
    let roleDoc = await Role.findOne({ name: role || "user" });
    if (!roleDoc) {
      roleDoc = await Role.create({ name: role || "user" });
    }

    // Tạo người dùng mới
    const user = new User({
      email,
      password,
      name,
      address,
      phone,
      avatar,
      date_of_birth,
      role_id: roleDoc._id,
    });
    await user.save();

    // Tạo tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: roleDoc.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: roleDoc.name },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Lưu tokens
    await Token.create({
      user_id: user._id,
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    res.status(201).success(
      {
        user: { id: user._id, email: user.email, role: roleDoc.name },
        accessToken,
        refreshToken,
      },
      "Đăng ký thành công"
    );
  } catch (error) {
    next(error);
  }
};

// Đăng nhập
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra người dùng
    const user = await User.findOne({ email, is_active: true }).populate("role_id");
    if (!user) {
      const error = new Error("Email hoặc mật khẩu không đúng");
      error.statusCode = 401;
      throw error;
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Email hoặc mật khẩu không đúng");
      error.statusCode = 401;
      throw error;
    }

    // Tạo tokens
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

    // Lưu tokens
    await Token.create({
      user_id: user._id,
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    res.success(
      {
        user: { id: user._id, email: user.email, role: user.role_id.name },
        accessToken,
        refreshToken,
      },
      "Đăng nhập thành công"
    );
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error("Refresh token là bắt buộc");
      error.statusCode = 400;
      throw error;
    }

    // Kiểm tra refresh token
    const tokenDoc = await Token.findOne({ refresh_token: refreshToken });
    if (!tokenDoc) {
      const error = new Error("Refresh token không hợp lệ");
      error.statusCode = 401;
      throw error;
    }

    // Xác minh refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Tạo access token mới
    const accessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Cập nhật access token
    tokenDoc.access_token = accessToken;
    tokenDoc.updatedAt = Date.now();
    await tokenDoc.save();

    res.success({ accessToken }, "Tạo access token mới thành công");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const err = new Error("Refresh token đã hết hạn");
      err.statusCode = 401;
      throw err;
    }
    if (error.name === "JsonWebTokenError") {
      const err = new Error("Refresh token không hợp lệ");
      err.statusCode = 401;
      throw err;
    }
    next(error);
  }
};