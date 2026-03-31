const AudioRecord = require('../models/AudioRecord');

/**
 * Audio Repository — Data access layer for AudioRecord collection.
 * Single Responsibility: Only handles database operations for audio records.
 */
const audioRepository = {
  async create(audioData) {
    const record = new AudioRecord(audioData);
    return record.save();
  },

  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const records = await AudioRecord.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await AudioRecord.countDocuments({ userId });
    return { records, total };
  },

  async findById(id) {
    return AudioRecord.findById(id);
  },

  async findByIdAndUserId(id, userId) {
    return AudioRecord.findOne({ _id: id, userId });
  },

  async deleteById(id) {
    return AudioRecord.findByIdAndDelete(id);
  },

  async updateStatus(id, status) {
    return AudioRecord.findByIdAndUpdate(id, { uploadStatus: status }, { new: true });
  },

  async countByUserId(userId) {
    return AudioRecord.countDocuments({ userId });
  },

  async getTotalDurationByUserId(userId) {
    const result = await AudioRecord.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: null, totalDuration: { $sum: '$duration' } } },
    ]);
    return result.length > 0 ? result[0].totalDuration : 0;
  },
};

module.exports = audioRepository;
