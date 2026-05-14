const Anthropic = require('@anthropic-ai/sdk');
const { SYSTEM_PROMPT_V2 } = require('../config/systemPrompt');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'AI Code Mentor'
  }
});

// Non-streaming response
const getChatResponse = async (messages) => {
  const response = await client.messages.create({
    model: 'anthropic/claude-3.5-sonnet',
    max_tokens: 1024,
    system: SYSTEM_PROMPT_V2,
    messages: messages
  });

  return response.content[0].text;
};

// Streaming response
const getChatResponseStream = async (messages, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await client.messages.stream({
    model: 'anthropic/claude-3.5-sonnet',
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

  res.write('data: [DONE]\n\n');
  res.end();
};

module.exports = { getChatResponse, getChatResponseStream };