Label: epic-3 features priority-high
Story Points: 2
Sprint: 3
Estimate: 1 day
Description:

As a user, I want to ask technical questions in a chat interface and get follow-up answers without losing context.

Acceptance Criteria:

 Chat interface on /chat page
 Multi-turn conversation with full history shown
 User messages right-aligned, AI messages left-aligned
 Streaming response displays token by token
 "New conversation" button clears history
 Enter key submits, Shift+Enter adds a newline

Tasks:

Build ChatWindow component
Wire to /api/chat with streaming
Style message bubbles