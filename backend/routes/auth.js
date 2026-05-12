const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// Protected route to test middleware
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted!', userId: req.userData.userId });
});

module.exports = router;