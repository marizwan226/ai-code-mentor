Label: epic-2 ai-core priority-med
Story Points: 2
Sprint: 2
Estimate: 1 day
Description:

As a user, I want the AI to recognize what programming language I'm using and tailor its advice accordingly.

Acceptance Criteria:

 Language auto-detected from code snippet (Python, JS, TS, SQL, Java, Go, etc.)
 Detected language shown in the UI as a badge
 System prompt includes detected language as context
 Manual override available (dropdown in UI)
 Works correctly for at least 6 languages

Tasks:

Integrate linguist-js or write regex-based detector
Add language badge to chat UI
Inject language context into system prompt