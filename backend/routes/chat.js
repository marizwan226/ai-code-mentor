const express = require('express');
const router = express.Router();
const { getChatResponse, getChatResponseStream } = require('../services/llm.service');
const { getSession, addMessage, clearSession } = require('../services/sessionStore');
const { trimHistory } = require('../services/tokenCounter');
const { v4: uuidv4 } = require('uuid');

// Non-streaming chat with session memory
router.post('/', async (req, res) => {
  try {
    const { messages, sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    // Use provided sessionId or generate new one
    const currentSessionId = sessionId || uuidv4();

    // Get existing history
    const history = getSession(currentSessionId);

    // Add new user message to history
    const newMessage = messages[messages.length - 1];
    addMessage(currentSessionId, newMessage.role, newMessage.content);

    // Get updated history and trim if needed
    const updatedHistory = getSession(currentSessionId);
    const trimmedHistory = trimHistory([...updatedHistory]);

    // Get AI response
    const response = await getChatResponse(trimmedHistory);

    // Add AI response to history
    addMessage(currentSessionId, 'assistant', response);

    res.json({ response, sessionId: currentSessionId });

  } catch (error) {
    res.status(500).json({ message: 'LLM request failed', error: error.message });
  }
});

// Streaming chat with session memory
router.post('/stream', async (req, res) => {
  try {
    const { messages, sessionId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    const currentSessionId = sessionId || uuidv4();
    const history = getSession(currentSessionId);
    const newMessage = messages[messages.length - 1];
    addMessage(currentSessionId, newMessage.role, newMessage.content);

    const updatedHistory = getSession(currentSessionId);
    const trimmedHistory = trimHistory([...updatedHistory]);

    await getChatResponseStream(trimmedHistory, res);

  } catch (error) {
    res.status(500).json({ message: 'Streaming failed', error: error.message });
  }
});

// Clear session
router.delete('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  clearSession(sessionId);
  res.json({ message: 'Session cleared', sessionId });
});

module.exports = router;