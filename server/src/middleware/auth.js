const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authentication required");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      res.status(401);
      throw new Error("User no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (res.statusCode !== 401) {
      res.status(401);
    }
    throw new Error("Invalid or expired authentication token");
  }
});

function authorize(...roles) {
  return function roleGuard(req, res, next) {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error("You do not have permission to perform this action"));
    }

    return next();
  };
}

module.exports = {
  protect,
  authorize,
};
