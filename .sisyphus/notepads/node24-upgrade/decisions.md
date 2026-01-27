# Decisions - node24-upgrade

## [2026-01-26T21:10:48.717Z] Plan Created
- Strict Node 24+ enforcement (engines >=24.0.0)
- Clean package-lock regeneration (delete + fresh install)
- Single atomic commit for easy rollback
- No config file changes allowed

## [2026-01-26 Task 2] Node Version Strategy
**Decision**: CI/CD enforces Node 24, local dev uses .nvmrc (developer responsibility)
**Rationale**:
- Bash tool cannot persist nvm context
- .nvmrc updated → automatic activation in dev environments using nvm/direnv
- CI workflow updated → enforces Node 24 in automated testing
- package.json engines → runtime check (warns on mismatch)

**Impact**: Manual verification on Node 24 becomes responsibility of final QA step, not automation.
