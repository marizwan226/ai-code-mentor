Label: epic-2 ai-core priority-high
Story Points: 3
Sprint: 2
Estimate: 1 day
Description:

As a developer, I want the backend to call an LLM API and return a response so the AI layer is functional end-to-end.

Acceptance Criteria:

 API key stored securely in .env, never in code
 POST /api/chat endpoint accepts { messages: [] } and returns AI response
 Streaming response supported (SSE or chunked)
 Works with Anthropic Claude or OpenAI — one must be live
 Tested via Postman or curl before wiring to frontend

Tasks:

Install @anthropic-ai/sdk or openai SDK
Create /services/llm.service.js
Build /api/chat route
Test with a hardcoded prompt