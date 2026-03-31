const fs = require('fs');
const path = require('path');
const audioRepository = require('../repositories/audioRepository');
const logger = require('../utils/logger');

/**
 * Audio Service — Business logic for audio operations.
 * Handles upload processing, history, and file management.
 */
const audioService = {
  /**
   * Process and save an uploaded audio file
   */
  async upload(userId, file, metadata) {
    const audioData = {
      userId,
      fileName: metadata.fileName || file.originalname,
      originalName: file.originalname,
      duration: parseFloat(metadata.duration) || 0,
      format: metadata.format || this.extractFormat(file.mimetype),
      sampleRate: parseInt(metadata.sampleRate, 10) || 44100,
      fileSize: file.size,
      mimeType: file.mimetype,
      filePath: file.path,
      uploadStatus: 'completed',
    };

    const record = await audioRepository.create(audioData);
    logger.info(`Audio uploaded: ${record.fileName} by user ${userId}`);

    return {
      id: record._id,
      fileName: record.fileName,
      duration: record.duration,
      format: record.format,
      sampleRate: record.sampleRate,
      fileSize: record.fileSize,
      uploadStatus: record.uploadStatus,
      createdAt: record.createdAt,
    };
  },

  /**
   * Get paginated recording history for a user
   */
  async getHistory(userId, page = 1, limit = 10) {
    const { records, total } = await audioRepository.findByUserId(userId, page, limit);

    const formatted = records.map((r) => ({
      id: r._id,
      fileName: r.fileName,
      duration: r.duration,
      format: r.format,
      sampleRate: r.sampleRate,
      fileSize: r.fileSize,
      uploadStatus: r.uploadStatus,
      createdAt: r.createdAt,
    }));

    return { records: formatted, total, page, limit };
  },

  /**
   * Get a single audio record by ID (user-scoped)
   */
  async getById(userId, audioId) {
    const record = await audioRepository.findByIdAndUserId(audioId, userId);

    if (!record) {
      const error = new Error('Audio record not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: record._id,
      fileName: record.fileName,
      originalName: record.originalName,
      duration: record.duration,
      format: record.format,
      sampleRate: record.sampleRate,
      fileSize: record.fileSize,
      mimeType: record.mimeType,
      uploadStatus: record.uploadStatus,
      createdAt: record.createdAt,
    };
  },

  /**
   * Delete an audio record and its file
   */
  async delete(userId, audioId) {
    const record = await audioRepository.findByIdAndUserId(audioId, userId);

    if (!record) {
      const error = new Error('Audio record not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete file from disk
    if (record.filePath && fs.existsSync(record.filePath)) {
      fs.unlinkSync(record.filePath);
      logger.info(`File deleted: ${record.filePath}`);
    }

    await audioRepository.deleteById(audioId);
    logger.info(`Audio record deleted: ${audioId} by user ${userId}`);

    return { id: audioId, fileName: record.fileName };
  },

  /**
   * Stream audio file for playback
   */
  async getFileStream(userId, audioId) {
    const record = await audioRepository.findByIdAndUserId(audioId, userId);

    if (!record) {
      const error = new Error('Audio record not found');
      error.statusCode = 404;
      throw error;
    }

    if (!fs.existsSync(record.filePath)) {
      const error = new Error('Audio file not found on disk');
      error.statusCode = 404;
      throw error;
    }

    return {
      stream: fs.createReadStream(record.filePath),
      mimeType: record.mimeType,
      fileName: record.fileName,
      fileSize: record.fileSize,
    };
  },

  /**
   * Extract format from MIME type
   */
  extractFormat(mimeType) {
    const formatMap = {
      'audio/webm': 'webm',
      'audio/ogg': 'ogg',
      'audio/wav': 'wav',
      'audio/x-wav': 'wav',
      'audio/wave': 'wav',
      'audio/mpeg': 'mp3',
      'audio/mp4': 'mp4',
    };
    return formatMap[mimeType] || 'webm';
  },
};

module.exports = audioService;
