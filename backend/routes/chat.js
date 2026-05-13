const express = require('express');
const router = express.Router();
const { getChatResponse, getChatResponseStream } = require('../services/llm.service');

// Non-streaming chat
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    const response = await getChatResponse(messages);
    res.json({ response });

  } catch (error) {
    res.status(500).json({ message: 'LLM request failed', error: error.message });
  }
});

// Streaming chat
router.post('/stream', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    await getChatResponseStream(messages, res);

  } catch (error) {
    res.status(500).json({ message: 'Streaming failed', error: error.message });
  }
});

module.exports = router;