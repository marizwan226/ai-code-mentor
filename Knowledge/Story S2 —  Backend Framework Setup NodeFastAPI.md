Label: epic-1 backend priority-high
Story Points: 2
Sprint: 1
Estimate: 0.5 day
Description:

As a developer, I want the backend initialized with correct structure so all API routes and services have a foundation to build on.

Acceptance Criteria:

 Express.js or FastAPI project initialized
 Environment variables handled via .env + dotenv
 CORS configured for local frontend
 Health check route: GET /health returns { status: ok }
 Folder structure: /routes, /controllers, /services, /middleware
 Code committed and pushed to develop

Tasks:

Install framework and dependencies
Create base app file
Add health check endpoint
Add .env.example with all required keys listed