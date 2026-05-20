Label: epic-3 features priority-high
Story Points: 3
Sprint: 3
Estimate: 1 day
Description:

As a user, I want to submit code and receive structured AI feedback on bugs, improvements, and best practices.

Acceptance Criteria:

 Response always structured in 3 sections: Issues Found / Improvements / What's Good
 Specific line references included where possible (e.g. "Line 12: ...")
 Code snippets in AI response are syntax-highlighted
 Copy response button works
 Review completes within 10 seconds for snippets under 100 lines

Tasks:

Write review-specific prompt template
Build response renderer with code block highlighting
Add copy button to response