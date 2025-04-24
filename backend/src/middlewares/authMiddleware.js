import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/errorHandler.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return errorResponse(res, 401, 'User not found');
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return errorResponse(res, 401, 'Not authorized, token failed');
    }
  } else {
    return errorResponse(res, 401, 'Not authorized, no token');
  }
};

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info (userId, role) to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 403, 'Access denied');
    }

    // console.log('User role:', req.user.role);
    // console.log('Allowed roles:', roles);   

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Access denied');
    }

    next();
  };
};

