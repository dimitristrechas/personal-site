# Fix Contact Page Hydration Mismatch

## Context

### Original Request
Fix hydration error on /contact page: server HTML differs from client due to dynamic timestamp in API response.

### Interview Summary
**Key Discussions**:
- Root cause: External Strapi API returns content with dynamic timestamp
- Server renders: `"<p>Reach out... Generated at 2026-01-26T21:07:14.005Z.</p>"`
- Client hydrates with: `""` (empty or different timestamp)
- Solution: Add `cache: 'force-cache'` to prevent refetch during hydration

**Research Findings**:
- 4 fetch calls without cache directives exist (contact, about, blog list, blog [slug])
- User requested fix for contact page only
- Other pages may have latent similar issues

### Metis Review
**Identified Gaps** (addressed):
- Production build verification needed (dev ≠ prod for hydration)
- Scope locked to contact page only (other pages flagged but not touched)

---

## Work Objectives

### Core Objective
Eliminate hydration mismatch on /contact by adding fetch cache directive.

### Concrete Deliverables
- Modified `app/contact/page.tsx` with `cache: 'force-cache'` option

### Definition of Done
- [x] No hydration error in browser console on /contact (dev mode)
- [x] No hydration error in browser console on /contact (prod mode)
- [x] `npm run build` completes without warnings

### Must Have
- `cache: 'force-cache'` added to fetch call in `app/contact/page.tsx`

### Must NOT Have (Guardrails)
- NO changes to `app/about/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- NO removal of timestamp content from API response rendering
- NO refactoring fetch into helper function
- NO adding revalidation/ISR logic
- NO error boundaries, logging, or monitoring code
- NO type changes or adjacent code "improvements"

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (no test files found)
- **User wants tests**: Manual-only
- **Framework**: none

### Manual QA

Each task verified via dev server + production build inspection.

---

## Task Flow

```
Task 1 (fix) → Task 2 (verify dev) → Task 3 (verify prod)
```

## Parallelization

| Task | Depends On | Reason |
|------|------------|--------|
| 2 | 1 | Need fix applied first |
| 3 | 1 | Need fix applied first |

---

## TODOs

- [x] 1. Add cache directive to contact page fetch

  **What to do**:
  - Add `{ cache: 'force-cache' }` as second argument to fetch call on line 6

  **Must NOT do**:
  - Refactor to helper function
  - Add error handling
  - Touch any other file

  **Parallelizable**: NO (must complete before verification)

  **References**:
  - `app/contact/page.tsx:6` - Fetch call to modify

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] File modified: `app/contact/page.tsx` line 6
  - [ ] Fetch call now includes `{ cache: 'force-cache' }` option
  - [ ] No other lines changed

  **Commit**: YES
  - Message: `fix(contact): add fetch cache to prevent hydration mismatch`
  - Files: `app/contact/page.tsx`

---

- [x] 2. Verify fix in development mode

  **What to do**:
  - Run dev server
  - Navigate to /contact
  - Check browser console for hydration errors

  **Must NOT do**:
  - Make code changes during verification
  - "Fix" anything else discovered

  **Parallelizable**: YES (with task 3, after task 1)

  **References**:
  - `package.json` - `npm run dev` command

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] Run: `npm run dev`
  - [ ] Navigate to: `http://localhost:3000/contact`
  - [ ] Open browser DevTools console
  - [ ] Verify: NO "Hydration failed" error in console
  - [ ] Verify: Page renders correctly with content

  **Commit**: NO

---

- [x] 3. Verify fix in production mode

  **What to do**:
  - Build production bundle
  - Start production server
  - Navigate to /contact
  - Check browser console for hydration errors

  **Must NOT do**:
  - Make code changes during verification

  **Parallelizable**: YES (with task 2, after task 1)

  **References**:
  - `package.json` - `npm run build`, `npm start` commands

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] Run: `npm run build`
  - [ ] Verify: Build completes without errors/warnings
  - [ ] Run: `npm start`
  - [ ] Navigate to: `http://localhost:3000/contact`
  - [ ] Open browser DevTools console
  - [ ] Verify: NO "Hydration failed" error in console
  - [ ] Verify: Page renders correctly with content

  **Commit**: NO

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(contact): add fetch cache to prevent hydration mismatch` | app/contact/page.tsx | npm run build |

---

## Success Criteria

### Verification Commands
```bash
npm run dev      # Start dev server, check /contact
npm run build    # Should complete without warnings
npm start        # Start prod server, check /contact
```

### Final Checklist
- [x] Hydration error gone in dev mode
- [x] Hydration error gone in prod mode
- [x] Build completes successfully
- [x] Only app/contact/page.tsx modified
- [x] No other files touched

---

## Notes for Executor

**Other pages with similar pattern** (NOT in scope, for future reference):
- `app/about/page.tsx:6` - same fetch pattern, may have latent hydration issue
- `app/blog/page.tsx:9` - same fetch pattern
- `app/blog/[slug]/page.tsx:6` - same fetch pattern

If user reports hydration issues on these pages later, apply same fix.
