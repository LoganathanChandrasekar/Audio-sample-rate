const { body } = require('express-validator');

const uploadValidation = [
  body('fileName')
    .trim()
    .notEmpty()
    .withMessage('File name is required')
    .isLength({ max: 200 })
    .withMessage('File name cannot exceed 200 characters')
    .matches(/^[a-zA-Z0-9_\-\s.]+$/)
    .withMessage('File name can only contain letters, numbers, spaces, hyphens, underscores, and dots'),

  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isFloat({ min: 0.1, max: 1800 })
    .withMessage('Duration must be between 0.1 and 1800 seconds (30 min)'),

  body('format')
    .optional()
    .trim()
    .isIn(['webm', 'ogg', 'wav', 'mp3', 'mp4'])
    .withMessage('Format must be webm, ogg, wav, mp3, or mp4'),

  body('sampleRate')
    .optional()
    .isInt({ min: 8000, max: 96000 })
    .withMessage('Sample rate must be between 8000 and 96000 Hz'),
];

module.exports = {
  uploadValidation,
};
