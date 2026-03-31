const tokenHelper = require('../utils/tokenHelper');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Authentication middleware.
 * Extracts JWT from Authorization header, verifies it,
 * and attaches the user object to req.user.
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token = tokenHelper.extractFromHeader(req.headers.authorization);

    // Fallback to query parameter for streaming/downloads (e.g., <audio> tags)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return ApiResponse.unauthorized(res, 'Access denied. No token provided.');
    }

    const decoded = tokenHelper.verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.unauthorized(res, 'Token is valid but user no longer exists.');
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid token.');
    }
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token has expired. Please login again.');
    }
    logger.error('Auth middleware error:', error.message);
    return ApiResponse.error(res, 'Authentication error', 500);
  }
};

module.exports = authMiddleware;
