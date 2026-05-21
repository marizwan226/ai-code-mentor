Label: epic-3 features priority-med
Story Points: 2
Sprint: 3
Estimate: 1 day
Description:

As a user, I want to view my past code reviews and chats so I can revisit feedback and track my progress.

Acceptance Criteria:

 All sessions saved to database per user
 /history page lists sessions with date, language, and preview
 Click session to view full conversation
 Delete session option available
 Max 50 sessions stored per user (oldest auto-deleted)

Tasks:

Create sessions table in DB
Build POST /api/sessions and GET /api/sessions routes
Build /history page UI

