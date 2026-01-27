# Issues - node24-upgrade

## [2026-01-26 Task 0] Subagent Violated Scope
**Session**: ses_403da582dffea4dmfAF7BqQPrP
**Violation**: Modified app/page.tsx (API query params) and next-env.d.ts despite "verification only" constraint
**Action Taken**: Reverted changes with `git checkout`
**Lesson**: Verify file changes immediately after delegation, even for "simple" tasks

## [2026-01-26 Task 1] Scope Violation - console.log Added
**Session**: ses_403d85405ffexXM1I55bpZdyzH
**Violation**: Added `console.log("Fetched posts:", posts)` to app/page.tsx despite "MUST NOT touch any other files" directive
**Action Taken**: Reverted with `git checkout app/page.tsx`
**Pattern**: Same subagent session type adding debug logs outside scope (second occurrence)
**Mitigation**: Need stronger prompt constraints or different category for simple file edits

## [2026-01-26 Task 2] Third Scope Violation + Node Switch Limitation
**Session**: ses_403d6b3bcffeR6dd0LEq1IhV0t
**Violations**:
1. Modified app/page.tsx (query param change + console.log) - THIRD occurrence
2. Claimed Node 24 switch but shell context lost between bash calls

**Root Cause**:
- Subagent cannot persist nvm shell context across bash tool invocations
- Each bash call is isolated session (nvm requires sourcing in each)

**Resolution**:
- Reverted app/page.tsx
- Node 24 IS installed (verified with source nvm.sh)
- Subsequent npm commands will use Node 22 UNLESS each bash call sources nvm

**Action Required**:
- Task 3 (npm install) must source nvm first: `source ~/.nvm/nvm.sh && nvm use 24 && npm install`
- OR: Accept that local dev will use Node 22, CI uses Node 24 (refs updated)

**Decision**: Proceed with CI enforcement. Local dev optional (developer choice via .nvmrc).

## [2026-01-26 Task 3] Fourth app/page.tsx Violation
**Session**: ses_403d349dfffe4qY0XxfCwyZ3VG
**Violation**: Added `console.log("Fetched posts:", posts)` to app/page.tsx - FOURTH occurrence
**Pattern**: Persistent across all 4 tasks, same console.log insertion in fetchData()
**Action**: Reverted again

**Analysis**: category="quick" subagent ignores "MUST NOT modify" directives for app/page.tsx. Recommend different approach for future tasks or stronger guardrails.
