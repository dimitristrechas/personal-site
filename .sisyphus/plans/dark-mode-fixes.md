# Dark Mode UI Fixes

## Context

### Original Request
Fix dark mode contrast issues: post title too grey, theme toggle missing cursor pointer, header title not visible, verify theme toggle alignment.

### Interview Summary
**Key Discussions**:
- No Shadcn/Radix packages to remove (confirmed not present)
- Header title uses `text-muted-foreground` - too grey in dark mode
- Theme toggle button missing pointer cursor
- Post title in blog posts has low contrast

**Research Findings**:
- `text-muted-foreground` used in: Header title, ThemeToggle hover, PostCard date
- Dark mode `--muted-foreground` is `hsl(0 0% 63.9%)` - low contrast
- Blog posts use `prose dark:prose-invert` but may need heading color override
- Theme toggle has `ml-4` spacing, aligned via flex

### Metis Review
**Identified Gaps** (addressed):
- Verify all `text-muted-foreground` usages before changing
- Lock down scope: no hover/transition/accessibility additions
- Clarify "post title" = markdown H1 in blog content

---

## Work Objectives

### Core Objective
Fix dark mode visibility issues for header title, blog post headings, and add pointer cursor to theme toggle.

### Concrete Deliverables
- Header title visible in dark mode
- Blog post H1/H2 headings with proper contrast in dark mode
- Theme toggle with pointer cursor
- Verified alignment of theme toggle with nav items

### Definition of Done
- [x] `npm run dev` → toggle to dark mode → header title clearly visible
- [x] Navigate to any blog post → headings have good contrast
- [x] Theme toggle shows pointer cursor on hover
- [x] Theme toggle aligned with nav items (same baseline)

### Must Have
- Header title uses `text-foreground` in dark mode
- Blog post headings have sufficient contrast in dark mode
- Theme toggle has `cursor-pointer`

### Must NOT Have (Guardrails)
- NO new hover effects or transitions (beyond existing)
- NO layout changes to theme toggle (`ml-4` stays)
- NO ARIA labels or accessibility additions (not requested)
- NO changes to PostCard date styling (intentionally muted)
- NO CSS variable modifications in globals.css

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (no test framework)
- **User wants tests**: Manual-only
- **Framework**: none

### Manual QA Approach
Visual verification via browser:
1. Run dev server
2. Toggle between light/dark modes
3. Check header, blog post page, theme toggle cursor

---

## Task Flow

```
Task 1 (Header title) ─┐
Task 2 (Post prose)   ─┼─→ Task 4 (Visual verification)
Task 3 (Cursor)       ─┘
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 1, 2, 3 | Independent file changes |

| Task | Depends On | Reason |
|------|------------|--------|
| 4 | 1, 2, 3 | Requires all changes to verify |

---

## TODOs

- [x] 1. Fix header title dark mode visibility

  **What to do**:
  - Change header title from `text-muted-foreground` to `text-foreground`
  - This makes it use the high-contrast foreground color in both modes

  **Must NOT do**:
  - Don't add hover effects
  - Don't change font size or weight

  **Parallelizable**: YES (with 2, 3)

  **References**:
  - `app/_components/Header/index.tsx:14` - Current title Link with `text-muted-foreground text-xl`
  - `app/global.css:16` - Dark mode `--foreground: 0 0% 98%` (high contrast white)

  **Acceptance Criteria**:
  - [x] Class changed from `text-muted-foreground text-xl` to `text-foreground text-xl`
  - [x] Manual: `npm run dev` → dark mode → "Dimitris Trechas" clearly visible (white/near-white)

  **Commit**: YES
  - Message: `fix(ui): header title dark mode visibility`
  - Files: `app/_components/Header/index.tsx`

---

- [x] 2. Fix blog post heading contrast in dark mode

  **What to do**:
  - Add custom prose heading styles for dark mode in global.css
  - Override `prose` heading colors to ensure high contrast in dark mode

  **Must NOT do**:
  - Don't modify the prose class on the article element
  - Don't change light mode heading styles

  **Parallelizable**: YES (with 1, 3)

  **References**:
  - `app/blog/[slug]/page.tsx:27` - Article element with `prose dark:prose-invert`
  - `app/global.css` - Add dark mode prose heading overrides
  - Tailwind Typography plugin: headings may inherit muted colors

  **Acceptance Criteria**:
  - [x] Dark prose headings use `--foreground` color (high contrast)
  - [x] Manual: Navigate to `/blog/[any-slug]` → dark mode → H1, H2 headings clearly readable

  **Commit**: YES
  - Message: `fix(ui): blog post heading contrast in dark mode`
  - Files: `app/global.css`

---

- [x] 3. Add cursor pointer to theme toggle

  **What to do**:
  - Add `cursor-pointer` class to theme toggle button
  - Verify alignment looks correct with nav items

  **Must NOT do**:
  - Don't change `ml-4` spacing
  - Don't add new hover effects or transitions

  **Parallelizable**: YES (with 1, 2)

  **References**:
  - `app/_components/ThemeToggle.tsx:21` - Button className needs `cursor-pointer`
  - `app/_components/Header/index.tsx:17-30` - Nav container for alignment reference

  **Acceptance Criteria**:
  - [x] Button has `cursor-pointer` in className
  - [x] Manual: Hover over theme toggle → cursor changes to pointer
  - [x] Visual: Theme toggle vertically aligned with nav links

  **Commit**: YES
  - Message: `fix(ui): theme toggle cursor pointer`
  - Files: `app/_components/ThemeToggle.tsx`

---

- [x] 4. Visual verification of all dark mode fixes

  **What to do**:
  - Run dev server and verify all fixes in dark mode
  - Check light mode didn't regress
  - Document with screenshots if needed

  **Must NOT do**:
  - Don't make additional styling changes

  **Parallelizable**: NO (depends on 1, 2, 3)

  **References**:
  - All files from tasks 1-3

  **Acceptance Criteria**:
  - [x] Using Playwright browser automation:
    - Navigate to `http://localhost:3001/`
    - Toggle to dark mode via theme button
    - Verify header title "Dimitris Trechas" is clearly visible (not grey)
    - Verify theme toggle shows pointer cursor
    - Navigate to `http://localhost:3001/blog`
    - Click any blog post
    - Verify H1 heading has high contrast in dark mode
    - Toggle to light mode → verify no regressions
  - [x] Screenshot evidence saved to `.sisyphus/evidence/`

  **Commit**: NO (verification only)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(ui): header title dark mode visibility` | Header/index.tsx | Visual check |
| 2 | `fix(ui): blog post heading contrast in dark mode` | global.css | Visual check |
| 3 | `fix(ui): theme toggle cursor pointer` | ThemeToggle.tsx | Visual check |

---

## Success Criteria

### Verification Commands
```bash
npm run dev  # Start dev server at localhost:3001
```

### Final Checklist
- [x] Header title visible in dark mode
- [x] Blog post headings have proper contrast in dark mode
- [x] Theme toggle has pointer cursor
- [x] Theme toggle aligned with nav items
- [x] Light mode unchanged/no regressions
