const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Auth Controller — Handles HTTP requests for authentication.
 * Single Responsibility: Only deals with request/response, delegates to service.
 */
const authController = {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      return ApiResponse.created(res, result, 'Registration successful');
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   */
  async getProfile(req, res, next) {
    try {
      const result = await authService.getProfile(req.user.id);
      return ApiResponse.success(res, result);
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  },
};

module.exports = authController;
