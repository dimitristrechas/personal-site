# Dark Mode Contrast Fix for About/Contact Pages

## Context

### Original Request
Fix dark mode contrast on about/contact pages using same pattern as blogposts.

### Finding
Blog posts use `prose dark:prose-invert` for proper dark mode text contrast. About/contact pages only use `prose` - missing `dark:prose-invert`.

---

## Work Objectives

### Core Objective
Add `dark:prose-invert` Tailwind class to prose elements on about/contact pages.

### Concrete Deliverables
- `app/about/page.tsx` - updated prose class
- `app/contact/page.tsx` - updated prose class

### Definition of Done
- [x] Both pages render markdown with proper contrast in dark mode

### Must NOT Have
- No other styling changes
- No refactoring

---

## TODOs

- [x] 1. Add dark:prose-invert to about page

  **What to do**:
  - In `app/about/page.tsx` line 22
  - Change `className="prose pt-4"` to `className="prose dark:prose-invert pt-4"`

  **Parallelizable**: YES (with 2)

  **References**:
  - `app/blog/[slug]/page.tsx:27` - existing pattern: `prose dark:prose-invert`

  **Acceptance Criteria**:
  - [ ] Class includes `dark:prose-invert`
  - [ ] `npm run lint` passes

  **Commit**: NO (groups with 2)

- [x] 2. Add dark:prose-invert to contact page

  **What to do**:
  - In `app/contact/page.tsx` line 22
  - Change `className="prose pt-4"` to `className="prose dark:prose-invert pt-4"`

  **Parallelizable**: YES (with 1)

  **References**:
  - `app/blog/[slug]/page.tsx:27` - existing pattern: `prose dark:prose-invert`

  **Acceptance Criteria**:
  - [ ] Class includes `dark:prose-invert`
  - [ ] `npm run lint` passes

  **Commit**: YES
  - Message: `fix(ui): add dark mode contrast to about/contact pages`
  - Files: `app/about/page.tsx`, `app/contact/page.tsx`

---

## Success Criteria

### Verification Commands
```bash
npm run lint  # Expected: no errors
npm run build  # Expected: successful build
```

### Manual Verification
- Visit `/about` and `/contact` in dark mode
- Text should have proper contrast (light text on dark background)
