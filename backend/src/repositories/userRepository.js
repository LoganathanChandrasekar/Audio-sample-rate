const User = require('../models/User');

/**
 * User Repository — Data access layer for User collection.
 * Single Responsibility: Only handles database operations for users.
 */
const userRepository = {
  async findByEmail(email) {
    return User.findOne({ email }).select('+password');
  },

  async findById(id) {
    return User.findById(id);
  },

  async create(userData) {
    const user = new User(userData);
    return user.save();
  },

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  },

  async existsByEmail(email) {
    const count = await User.countDocuments({ email });
    return count > 0;
  },
};

module.exports = userRepository;
