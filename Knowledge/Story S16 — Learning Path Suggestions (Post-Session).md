Label: epic-3 features priority-low
Story Points: 2
Sprint: 3
Estimate: 0.5 day

⚠️ Cut this if behind schedule. Ship it in v1.1.

Description:

As a user, I want the AI to suggest what I should learn next based on errors or gaps it spotted in my code.

Acceptance Criteria:

 After review completes, AI appends a "Next Steps" section
 Suggestions are specific (e.g. "Learn async/await patterns" not "learn JavaScript")
 Max 3 suggestions shown
 Links to free resources (MDN, docs.python.org) optional

Tasks:

Add "next steps" clause to review prompt
Render suggestions as a styled card below the review