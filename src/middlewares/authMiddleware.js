import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      const error = new Error("Yêu cầu token xác thực");
      error.statusCode = 401;
      throw error;
    }

    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const err = new Error("Access token đã hết hạn");
      err.statusCode = 401;
      throw err;
    }
    if (error.name === "JsonWebTokenError") {
      const err = new Error("Access token không hợp lệ");
      err.statusCode = 401;
      throw err;
    }
    next(error);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    const error = new Error("Yêu cầu quyền admin");
    error.statusCode = 403;
    throw error;
  }
  next();
};