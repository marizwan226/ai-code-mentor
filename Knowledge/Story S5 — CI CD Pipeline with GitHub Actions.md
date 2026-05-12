Label: epic-1 devops priority-med
Story Points: 2
Sprint: 1 
Estimate: 0.5 day
Description:

As a developer, I want automated checks on every push so broken code never reaches main.

Acceptance Criteria:

 GitHub Action triggers on push to develop and PRs to main
 Lint check passes (ESLint for frontend, flake8/pylint for backend)
 At least 1 smoke test runs in CI
 Build step succeeds
 Badge added to README showing CI status

Tasks:

Create .github/workflows/ci.yml
Add lint and build scripts to package.json
Test pipeline on a dummy push