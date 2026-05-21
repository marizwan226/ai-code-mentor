const express = require('express');
const router = express.Router();
const {
  saveSession,
  getSessions,
  getSession,
  deleteSession
} = require('../controllers/sessionController');

// Save or update session
router.post('/', saveSession);

// Get all sessions
router.get('/', getSessions);

// Get single session
router.get('/:sessionId', getSession);

// Delete session
router.delete('/:sessionId', deleteSession);

module.exports = router;