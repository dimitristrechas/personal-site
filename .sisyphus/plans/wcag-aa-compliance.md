# WCAG AA Compliance Audit & Fixes

## Context

### Original Request
Verify accessibility compliance, target AA WCAG compliance, report and fix issues.

### Interview Summary
**Key Discussions**:
- Identified 6 WCAG AA violations via codebase audit
- No test infrastructure; use manual verification
- Fix all identified issues, not just document them

**Research Findings**:
- Existing a11y: `lang="en"`, semantic HTML structure, alt text on images, sr-only search label, aria-label on theme toggle
- Missing: skip link, aria-current, explicit focus styles, role="search"
- Home page has two visual headings but "Welcome friend!" is `<span>` while "Latest Posts" is `<h1>`

### Metis Review
**Identified Gaps** (addressed):
- Tag contrast scope: Will document + provide CSS fallback for failing contrast
- Focus styles: Will verify all interactive elements in modified files
- aria-current: Exact path match only (standard)
- Heading hierarchy: All pages have proper `<h1>` except home welcome text

---

## Work Objectives

### Core Objective
Achieve WCAG 2.1 AA compliance for all identified violations.

### Concrete Deliverables
- Skip link component in layout
- aria-current attributes on active nav links
- role="search" on search container
- Explicit focus-visible styles in CSS
- Fixed heading hierarchy on home page
- Tag contrast audit with CSS fallback

### Definition of Done
- [x] Manual keyboard navigation works (Tab through all elements)
- [x] Skip link appears on focus and jumps to main content
- [x] Screen reader announces current page in navigation
- [x] All interactive elements show visible focus indicator
- [x] Lighthouse accessibility score ≥90%

### Must Have
- WCAG 2.1 AA compliance for all 6 identified issues
- No regression in existing accessibility features

### Must NOT Have (Guardrails)
- NO automated testing infrastructure (axe-core, jest-axe)
- NO WCAG AAA criteria
- NO CMS/Strapi changes
- NO refactoring beyond minimum required fixes
- NO new global utility components
- NO focus-visible polyfills

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only
- **Framework**: none

### Manual QA Procedures
Each task verified via:
1. Keyboard navigation (Tab, Shift+Tab, Enter)
2. Visual inspection of focus indicators
3. Lighthouse accessibility audit in Chrome DevTools

---

## Task Flow

```
Task 1 (Skip Link) → Task 2 (aria-current) → Task 3 (role=search)
                                          → Task 4 (Focus styles)
                                          → Task 5 (Home heading)
Task 6 (Tag contrast) - independent, can run parallel
Task 7 (Final audit) - depends on ALL
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 3, 4, 5 | Independent components after nav fixes |
| B | 6 | PostCard independent of layout changes |

| Task | Depends On | Reason |
|------|------------|--------|
| 2 | 1 | Both in Header/layout, test together |
| 7 | 1-6 | Final verification of all fixes |

---

## TODOs

- [x] 1. Add skip link to layout

  **What to do**:
  - Add skip link as first focusable element in body
  - Target: `#main-content` anchor
  - Pattern: sr-only → visible-on-focus
  - Add `id="main-content"` to `<main>` element

  **Must NOT do**:
  - Create new SkipLink component file (inline in layout)
  - Refactor existing sr-only styles
  - Add focus-visible polyfill

  **Parallelizable**: NO (first task)

  **References**:
  - `app/layout.tsx:14-47` - RootLayout where skip link goes before Header
  - `app/global.css:1-35` - Existing sr-only pattern (implied by search label usage)
  - WebAIM skip link pattern: `https://webaim.org/techniques/skipnav/`

  **Acceptance Criteria**:
  - [ ] Tab from browser address bar → skip link receives focus
  - [ ] Skip link becomes visible when focused (white background, dark text)
  - [ ] Press Enter → focus moves to main content
  - [ ] Skip link hidden again when focus leaves
  - [ ] Lighthouse: "Bypass blocks" passes

  **Commit**: YES
  - Message: `a11y: add skip link for keyboard navigation`
  - Files: `app/layout.tsx`, `app/global.css`
  - Pre-commit: `npm run lint`

---

- [x] 2. Add aria-current to active nav links

  **What to do**:
  - Add `aria-current="page"` to Link when `pathname === href`
  - Apply to all nav links in Header (blog, about, contact)
  - Home link gets aria-current only when pathname === "/"

  **Must NOT do**:
  - Add aria-label to nav element (semantic nav sufficient)
  - Change routing logic
  - Add partial path matching (e.g., /blog matches /blog/post-slug)

  **Parallelizable**: NO (depends on 1, test layout together)

  **References**:
  - `app/_components/Header/index.tsx:11-32` - Nav links with existing pathname check
  - MDN aria-current: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current`

  **Acceptance Criteria**:
  - [ ] On /blog: blog link has `aria-current="page"`
  - [ ] On /about: about link has `aria-current="page"`
  - [ ] On /contact: contact link has `aria-current="page"`
  - [ ] On /: home link has `aria-current="page"`, others don't
  - [ ] VoiceOver announces "current page" for active link

  **Commit**: YES
  - Message: `a11y: add aria-current to active nav links`
  - Files: `app/_components/Header/index.tsx`
  - Pre-commit: `npm run lint`

---

- [x] 3. Add role="search" to search container

  **What to do**:
  - Change `<search>` element to `<div role="search">`
  - The `<search>` HTML element is too new (2023), not universally supported
  - Keep existing sr-only label

  **Must NOT do**:
  - Add aria-live region
  - Refactor search component structure
  - Add form element (current pattern is valid)

  **Parallelizable**: YES (with 4, 5)

  **References**:
  - `app/blog/ClientComponent.tsx:24-39` - Search container with `<search>` element
  - WAI-ARIA search role: `https://www.w3.org/TR/wai-aria-1.1/#search`

  **Acceptance Criteria**:
  - [ ] DOM shows `<div role="search">` instead of `<search>`
  - [ ] Screen reader announces "search" landmark
  - [ ] Search functionality unchanged
  - [ ] Lighthouse: no accessibility warnings for search

  **Commit**: YES
  - Message: `a11y: use role="search" for broader support`
  - Files: `app/blog/ClientComponent.tsx`
  - Pre-commit: `npm run lint`

---

- [x] 4. Add explicit focus-visible styles

  **What to do**:
  - Add focus-visible ring to interactive elements in CSS
  - Target: links, buttons, inputs
  - Use Tailwind's ring utilities via custom CSS
  - Ensure 3:1 contrast ratio for focus indicator

  **Must NOT do**:
  - Remove outline:none from any existing styles
  - Add focus-visible polyfill
  - Change component files (CSS only)

  **Parallelizable**: YES (with 3, 5)

  **References**:
  - `app/global.css:1-35` - Global styles location
  - WCAG 2.4.7: `https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html`
  - Tailwind focus ring: `https://tailwindcss.com/docs/ring-width`

  **Acceptance Criteria**:
  - [ ] Tab to link → visible ring appears (2px, offset)
  - [ ] Tab to button (theme toggle) → visible ring
  - [ ] Tab to input (search) → visible ring
  - [ ] Focus ring has ≥3:1 contrast against background
  - [ ] Works in both light and dark mode

  **Commit**: YES
  - Message: `a11y: add focus-visible indicators`
  - Files: `app/global.css`
  - Pre-commit: `npm run lint`

---

- [x] 5. Fix home page heading hierarchy

  **What to do**:
  - Change "Welcome friend!" from `<span>` to `<h1>`
  - Change "Latest Posts" from `<h1>` to `<h2>`
  - Maintains proper hierarchy: h1 (welcome) → h2 (latest posts)

  **Must NOT do**:
  - Touch About/Contact pages (they already have proper h1)
  - Add aria-level attributes
  - Change font sizes (style h1 visually smaller if needed)

  **Parallelizable**: YES (with 3, 4)

  **References**:
  - `app/page.tsx:31` - "Welcome friend!" as span
  - `app/page.tsx:39` - "Latest Posts" as h1
  - WCAG 1.3.1: `https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html`

  **Acceptance Criteria**:
  - [ ] Home page has exactly one `<h1>` ("Welcome friend!")
  - [ ] "Latest Posts" is `<h2>`
  - [ ] Screen reader outline shows h1 → h2 hierarchy
  - [ ] Visual appearance unchanged (text-2xl preserved)
  - [ ] Lighthouse: "Heading elements in sequential order" passes

  **Commit**: YES
  - Message: `a11y: fix home page heading hierarchy`
  - Files: `app/page.tsx`
  - Pre-commit: `npm run lint`

---

- [x] 6. Audit tag contrast and add CSS fallback

  **What to do**:
  - Document: Tags use `text-white` on CMS-provided background colors
  - Add CSS fallback: ensure white text has minimum 4.5:1 contrast
  - If CMS color fails, apply text-shadow or darker overlay

  **Must NOT do**:
  - Build runtime contrast checker
  - Modify CMS/Strapi schemas
  - Change tag structure

  **Parallelizable**: YES (independent of other tasks)

  **References**:
  - `app/_components/PostCard/index.tsx:25-32` - Tag rendering with inline backgroundColor
  - WCAG 1.4.3: `https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html`
  - Contrast checker: `https://webaim.org/resources/contrastchecker/`

  **Acceptance Criteria**:
  - [ ] Documented which tag colors from CMS may fail contrast
  - [ ] CSS provides fallback (text-shadow for legibility) for all tags
  - [ ] White text readable on any background color
  - [ ] Visual appearance acceptable (subtle shadow, not harsh)

  **Commit**: YES
  - Message: `a11y: improve tag contrast with text shadow fallback`
  - Files: `app/_components/PostCard/index.tsx`
  - Pre-commit: `npm run lint`

---

- [x] 7. Final accessibility audit

  **What to do**:
  - Run Lighthouse accessibility audit on all pages
  - Test keyboard navigation flow on all pages
  - Verify all previous acceptance criteria hold together
  - Document final compliance state

  **Must NOT do**:
  - Add automated testing infrastructure
  - Fix new issues discovered (out of scope, document for future)

  **Parallelizable**: NO (depends on 1-6)

  **References**:
  - All modified files from tasks 1-6
  - Lighthouse DevTools: `https://developer.chrome.com/docs/lighthouse/accessibility/`

  **Acceptance Criteria**:
  - [ ] Lighthouse accessibility score ≥90% on home page
  - [ ] Lighthouse accessibility score ≥90% on /blog
  - [ ] Lighthouse accessibility score ≥90% on /about
  - [ ] Lighthouse accessibility score ≥90% on /contact
  - [ ] Full keyboard navigation works: Tab through all pages, use skip link
  - [ ] All 6 original issues resolved

  **Commit**: NO (audit only)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `a11y: add skip link for keyboard navigation` | layout.tsx, global.css | Tab test |
| 2 | `a11y: add aria-current to active nav links` | Header/index.tsx | Screen reader |
| 3 | `a11y: use role="search" for broader support` | ClientComponent.tsx | Landmark test |
| 4 | `a11y: add focus-visible indicators` | global.css | Tab through |
| 5 | `a11y: fix home page heading hierarchy` | page.tsx | Heading outline |
| 6 | `a11y: improve tag contrast with text shadow fallback` | PostCard/index.tsx | Visual check |

---

## Success Criteria

### Verification Commands
```bash
npm run lint        # Expected: 0 errors
npm run build       # Expected: successful build
```

### Final Checklist
- [x] All 6 WCAG AA violations fixed
- [x] No new accessibility issues introduced
- [x] Lighthouse score ≥90% on all pages
- [x] Keyboard navigation fully functional
- [x] All commits pass linting
