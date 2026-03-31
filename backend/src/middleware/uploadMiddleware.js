const upload = require('../config/multer');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Upload middleware for single audio file.
 * Wraps multer with custom error handling.
 */
const uploadMiddleware = (req, res, next) => {
  const singleUpload = upload.single('audio');

  singleUpload(req, res, (err) => {
    if (err) {
      logger.error('Upload middleware error:', err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return ApiResponse.error(res, 'File size exceeds the maximum limit', 413);
      }
      return ApiResponse.error(res, err.message, 400);
    }
    next();
  });
};

module.exports = uploadMiddleware;
