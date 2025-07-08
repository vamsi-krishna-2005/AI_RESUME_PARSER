const express = require('express');
const { register, login, refresh, logout, getUser, updateUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authMiddleware, getUser);
router.put('/me', authMiddleware, updateUser);

module.exports = router; 