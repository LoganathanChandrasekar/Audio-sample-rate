const audioService = require('../services/audioService');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Audio Controller — Handles HTTP requests for audio operations.
 * Single Responsibility: Only deals with request/response, delegates to service.
 */
const audioController = {
  /**
   * POST /api/audio/upload
   */
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'No audio file provided', 400);
      }

      const metadata = {
        fileName: req.body.fileName,
        duration: req.body.duration,
        format: req.body.format,
        sampleRate: req.body.sampleRate,
      };

      const result = await audioService.upload(req.user.id, req.file, metadata);
      return ApiResponse.created(res, result, 'Audio uploaded successfully');
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  },

  /**
   * GET /api/audio/history
   */
  async getHistory(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const { records, total } = await audioService.getHistory(req.user.id, page, limit);
      return ApiResponse.paginated(res, records, page, limit, total);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/audio/:id
   */
  async getById(req, res, next) {
    try {
      const result = await audioService.getById(req.user.id, req.params.id);
      return ApiResponse.success(res, result);
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  },

  /**
   * DELETE /api/audio/:id
   */
  async delete(req, res, next) {
    try {
      const result = await audioService.delete(req.user.id, req.params.id);
      return ApiResponse.success(res, result, 'Audio deleted successfully');
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  },

  /**
   * GET /api/audio/:id/stream
   */
  async stream(req, res, next) {
    try {
      const { stream, mimeType, fileName, fileSize } = await audioService.getFileStream(
        req.user.id,
        req.params.id
      );

      res.set({
        'Content-Type': mimeType,
        'Content-Length': fileSize,
        'Content-Disposition': `inline; filename="${fileName}"`,
      });

      stream.pipe(res);
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      next(error);
    }
  },
};

module.exports = audioController;
