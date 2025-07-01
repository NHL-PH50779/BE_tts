import User from "../models/User.js";
import Role from "../models/Role.js";

// [GET] /api/users - Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("role_id").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// [GET] /api/users/:id - Lấy thông tin người dùng theo ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("role_id");
    if (!user) throw new Error("Không tìm thấy người dùng");
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// [PATCH] /api/users/:id - Cập nhật thông tin người dùng
export const updateUser = async (req, res, next) => {
  try {
    const { name, phone, address, date_of_birth, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, date_of_birth, avatar },
      { new: true }
    );

    if (!updatedUser) throw new Error("Không tìm thấy người dùng");

    res.json({ success: true, message: "Cập nhật thành công", data: updatedUser });
  } catch (err) {
    next(err);
  }
};

// [PATCH] /api/users/:id/status - Khóa / Mở tài khoản
export const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("Không tìm thấy người dùng");

    user.is_active = !user.is_active;
    await user.save();

    res.json({
      success: true,
      message: user.is_active ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// [PATCH] /api/users/:id/role - Cập nhật vai trò
export const updateUserRole = async (req, res, next) => {
  try {
    const { roleName } = req.body;

    const role = await Role.findOne({ name: roleName });
    if (!role) throw new Error("Vai trò không tồn tại");

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role_id: role._id },
      { new: true }
    );

    if (!user) throw new Error("Không tìm thấy người dùng");

    res.json({ success: true, message: "Cập nhật vai trò thành công", data: user });
  } catch (err) {
    next(err);
  }
};
