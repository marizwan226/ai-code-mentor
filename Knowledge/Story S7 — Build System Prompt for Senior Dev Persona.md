Label: epic-2 ai-core prompt-engineering priority-high
Story Points: 3
Sprint: 2
Estimate: 1 day
Description:

As a user, I want the AI to behave like a senior developer — direct, opinionated, code-focused — not a generic chatbot.

Acceptance Criteria:

 System prompt defines persona: senior developer, blunt, no fluff
 AI gives structured feedback: What's wrong → Why → Fix
 Tone is professional but direct, not motivational
 Tested with 5 different code samples across Python, JS, SQL
 System prompt stored in a dedicated config file (easy to update)
 Prompt version documented in /docs/prompt-versions.md

Tasks:

Write v1 system prompt
Test against edge cases
Iterate and lock v2 before Sprint 3