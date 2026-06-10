const Anthropic = require('@anthropic-ai/sdk');
const { SYSTEM_PROMPT_V2 } = require('../config/systemPrompt');

const client = new Anthropic({
  apiKey: process.env.API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'AI Code Mentor'
  }
});

// Non-streaming response with 30s timeout
const getChatResponse = async (messages) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await client.messages.create({
      model: 'anthropic/claude-3-haiku',
      max_tokens: 1024,
      system: SYSTEM_PROMPT_V2,
      messages: messages
    });
    clearTimeout(timeout);
    return response.content[0].text;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('LLM request timeout after 30 seconds');
    }
    throw error;
  }
};

// Streaming response with 30s timeout
const getChatResponseStream = async (messages, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const stream = await client.messages.stream({
      model: 'anthropic/claude-3-haiku',
      max_tokens: 1024,
      system: SYSTEM_PROMPT_V2,
      messages: messages
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    clearTimeout(timeout);
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      res.write(`data: ${JSON.stringify({ error: 'Request timeout after 30 seconds' })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    }
    res.end();
  }
};

module.exports = { getChatResponse, getChatResponseStream };