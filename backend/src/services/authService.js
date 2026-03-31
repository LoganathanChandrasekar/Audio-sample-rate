const userRepository = require('../repositories/userRepository');
const tokenHelper = require('../utils/tokenHelper');
const logger = require('../utils/logger');

/**
 * Auth Service — Business logic for authentication.
 * Handles registration, login, and token management.
 */
const authService = {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    // Check if user already exists
    const exists = await userRepository.existsByEmail(email);
    if (exists) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    // Create user
    const user = await userRepository.create({ name, email, password });

    // Generate token
    const token = tokenHelper.generateToken({ id: user._id, email: user.email });

    logger.info(`New user registered: ${email}`);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },

  /**
   * Login a user with email and password
   */
  async login({ email, password }) {
    // Find user with password field
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = tokenHelper.generateToken({ id: user._id, email: user.email });

    logger.info(`User logged in: ${email}`);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },

  /**
   * Get current user profile
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
};

module.exports = authService;
