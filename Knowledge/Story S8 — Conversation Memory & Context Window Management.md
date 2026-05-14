Label: epic-2 ai-core priority-high
Story Points: 3
Sprint: 2
Estimate: 1 day
Description:

As a user, I want the AI to remember what we discussed in the current session so I don't have to repeat context.

Acceptance Criteria:

 Chat history stored per user session
 History passed to LLM on each request (rolling window)
 Token count monitored — old messages trimmed beyond 80% of model limit
 New session starts fresh (no bleed from old session)
 History persists across page refresh within same session

Tasks:

Build session store (Redis or in-memory map)
Implement message trimming logic
Pass history array in every API call

