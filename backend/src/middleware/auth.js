const jwt = require("jsonwebtoken");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");

// Protect Routes (JWT)
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(errorResponse("Not authorized, token missing", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find User
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(errorResponse("User not found", 401));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(errorResponse("Not authorized, token invalid", 401));
  }
};

// Role Authorization
exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        errorResponse("You do not have permission to access this route", 403)
      );
    }
    next();
  };
