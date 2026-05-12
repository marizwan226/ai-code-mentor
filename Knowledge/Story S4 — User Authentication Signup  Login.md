Label: epic-1 auth priority-high
Story Points: 3
Sprint: 1
Estimate: 1 day
Description:

As a user, I want to sign up and log in securely so my sessions and history are tied to my account.

Acceptance Criteria:

 Signup: email + password creates user record
 Login: returns JWT token on success
 JWT stored in httpOnly cookie or localStorage
 Protected routes return 401 without valid token
 Password hashed with bcrypt (never stored plaintext)
 Auth state persists on page refresh

Tasks:

Install Clerk / Auth0 OR build JWT manually
Create /auth/signup and /auth/login API routes
Add auth middleware to protect routes
Build frontend login/signup forms