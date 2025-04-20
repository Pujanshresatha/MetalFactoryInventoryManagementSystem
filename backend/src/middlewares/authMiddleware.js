const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/errorHandler');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return errorResponse(res, 401, 'Not authorized, token failed');
    }
  } else {
    return errorResponse(res, 401, 'Not authorized, no token');
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Access denied');
    }
    next();
  };
};

module.exports = { protect, restrictTo };