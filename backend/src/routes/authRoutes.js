const express = require('express');
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', ...registerValidation, validateRequest, authController.register);

// POST /api/auth/login
router.post('/login', ...loginValidation, validateRequest, authController.login);

// GET /api/auth/me — Protected
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
