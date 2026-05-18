Label: epic-2 backend priority-med
Story Points: 2
Sprint: 2
Estimate: 1 day
Description:

As a developer, I want the API to handle failures gracefully so the app doesn't crash on LLM errors or abuse.

Acceptance Criteria:

 Max 20 requests/minute per user enforced
 User sees a friendly message when rate limited (not a 500 error)
 LLM API timeout handled (default 30s, then error message)
 Quota exceeded error handled with clear user message
 All errors logged server-side with timestamp and user ID

Tasks:

Install express-rate-limit
Wrap all LLM calls in try/catch
Create centralized error handler middleware
Add toast notifications on frontend for errors