const jwt = require('jsonwebtoken');
const env = require('../config/env');

const tokenHelper = {
  /**
   * Generate a JWT token for a user
   */
  generateToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  },

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
  },

  /**
   * Extract token from Authorization header
   */
  extractFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  },
};

module.exports = tokenHelper;
