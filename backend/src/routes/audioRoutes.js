const express = require('express');
const audioController = require('../controllers/audioController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const { uploadValidation } = require('../validators/audioValidator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// All audio routes require authentication
router.use(authMiddleware);

// POST /api/audio/upload
router.post('/upload', uploadMiddleware, ...uploadValidation, validateRequest, audioController.upload);

// GET /api/audio/history
router.get('/history', audioController.getHistory);

// GET /api/audio/:id
router.get('/:id', audioController.getById);

// GET /api/audio/:id/stream
router.get('/:id/stream', audioController.stream);

// DELETE /api/audio/:id
router.delete('/:id', audioController.delete);

module.exports = router;
