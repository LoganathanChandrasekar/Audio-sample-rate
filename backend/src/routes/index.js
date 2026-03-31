const express = require('express');
const authRoutes = require('./authRoutes');
const audioRoutes = require('./audioRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SampleRate Audio API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/audio', audioRoutes);

module.exports = router;
