const express = require('express');
const authController = require('../controllers/auth.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', verifyRefreshToken, authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', verifyAccessToken, authController.me);

module.exports = router;
