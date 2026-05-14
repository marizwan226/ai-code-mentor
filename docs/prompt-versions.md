# Prompt Version History

## v2.0 (Current) — Sprint 2
**File:** `backend/config/systemPrompt.js`
**Status:** Active

### Persona
- Senior software engineer, 15+ years experience
- Direct, opinionated, no fluff
- Code reviewer mindset

### Response Format
1. **What's Wrong** — specific issues with line numbers
2. **Why It Matters** — impact on bugs, performance, security
3. **The Fix** — full corrected code

### Changes from v1
- Added strict response structure
- Removed motivational language
- Added security issue priority rules
- Added "No issues found" response for clean code

---

## v1.0 — Sprint 1
**Status:** Deprecated
**Notes:** Generic assistant prompt, no structured feedback format