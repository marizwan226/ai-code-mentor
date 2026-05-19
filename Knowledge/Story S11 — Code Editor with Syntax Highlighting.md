Label: epic-3 frontend priority-high
Story Points: 3
Sprint: 3
Estimate: 1 day
Description:

As a user, I want a real code editor in the browser so I can write or paste code comfortably before submitting for review.

Acceptance Criteria:

 Monaco Editor or CodeMirror embedded in /review page
 Syntax highlighting for Python, JS, TS, SQL, Java
 Language selector dropdown (auto-detect + manual)
 "Submit for Review" button wired to /api/chat
 File upload supported (.py, .js, .ts, .sql, .java)
 Editor is mobile-usable (responsive)

Tasks:

Install @monaco-editor/react
Build CodeEditor component
Connect submit button to AI service