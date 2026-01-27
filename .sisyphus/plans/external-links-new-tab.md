# External Links Open in New Tab (PERS-21)

## Context

### Original Request
Links inside blogposts or about/contact content from Strapi should open in a new tab. Add visual indicator and accessibility support.

### Interview Summary
**Key Discussions**:
- Scope: External links only (http/https), not internal
- Visual: Unicode arrow ↗ after link text
- Accessibility: Screen reader text "(opens in new tab)"
- Architecture: Shared `lib/markdown.ts` utility
- Security: `rel="noopener noreferrer"` required

**Research Findings**:
- marked v17.0.1 uses token-based renderer API via `marked.use()`
- UX research recommends same-tab default, but user explicitly wants new-tab for external
- WCAG 3.2.5 requires warning users about new tabs

### Metis Review
**Identified Gaps** (addressed):
- Arrow placement: Inside link (entire thing clickable)
- Internal link detection: Relative paths, anchors, mailto/tel = NOT external
- Screen reader approach: Using sr-only span (more robust than aria-label)
- Edge cases: mailto/tel excluded, protocol-relative URLs treated as external

---

## Work Objectives

### Core Objective
Configure marked to render external links with `target="_blank"`, security attributes, visual indicator, and accessibility text.

### Concrete Deliverables
- `lib/markdown.ts` - Shared markdown parsing utility with custom link renderer
- Updated `app/blog/[slug]/page.tsx` - Use shared utility
- Updated `app/about/page.tsx` - Use shared utility
- Updated `app/contact/page.tsx` - Use shared utility

### Definition of Done
- [x] External links (http/https) open in new tab
- [x] External links show ↗ indicator
- [x] External links have sr-only "(opens in new tab)" text
- [x] External links have `rel="noopener noreferrer"`
- [x] Internal/relative/anchor links unchanged
- [x] All 3 pages use shared utility

### Must Have
- `target="_blank"` on external links
- `rel="noopener noreferrer"` for security
- Unicode arrow ↗ visible indicator
- Screen reader accessible text
- Shared utility (no code duplication)

### Must NOT Have (Guardrails)
- NO link validation or broken link checks
- NO URL sanitization beyond current marked behavior
- NO configuration files or options objects
- NO CSS classes or Tailwind utilities for arrow (inherit link styles)
- NO changes to internal link behavior
- NO modifications to pages beyond the 3 specified
- NO analytics or click tracking

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: Manual-only
- **Framework**: None

### Manual QA Approach

Each TODO includes Playwright browser verification:
- Navigate to page with external links
- Verify visual indicator present
- Click link, verify new tab opens
- Inspect accessibility attributes

---

## Task Flow

```
Task 1 (create utility) → Task 2, 3, 4 (update pages, parallel)
                                    ↓
                              Task 5 (verify)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 2, 3, 4 | Independent page updates |

| Task | Depends On | Reason |
|------|------------|--------|
| 2, 3, 4 | 1 | Need utility to exist first |
| 5 | 2, 3, 4 | Need all pages updated before verification |

---

## TODOs

- [x] 1. Create shared markdown utility with custom link renderer

  **What to do**:
  - Create `lib/markdown.ts`
  - Import `marked` from `marked` and `matter` from `gray-matter`
  - Configure custom link renderer via `marked.use()`
  - Renderer logic:
    - Check if `href` starts with `http://` or `https://`
    - If external: add `target="_blank"`, `rel="noopener noreferrer"`, append `↗`, add sr-only span
    - If not external: render default anchor
  - Export function `parseMarkdown(content: string): string` that runs gray-matter + marked

  **Implementation detail**:
  ```typescript
  // External link detection
  const isExternal = href.startsWith('http://') || href.startsWith('https://');
  
  // Render with accessibility
  if (isExternal) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ''}>${text}↗<span class="sr-only"> (opens in new tab)</span></a>`;
  }
  ```

  **Must NOT do**:
  - NO URL validation or error handling
  - NO config options or abstraction layers
  - NO CSS classes on the arrow

  **Parallelizable**: NO (dependency for tasks 2-4)

  **References**:
  - `app/blog/[slug]/page.tsx:1-2` - Current marked/gray-matter import pattern
  - `app/blog/[slug]/page.tsx:15-16` - Current markdown parsing pattern
  - marked v17 renderer API: token-based `link(token)` with `token.href`, `token.title`, `token.tokens`

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [x] File exists: `ls lib/markdown.ts` → file present
  - [x] TypeScript valid: `npx tsc --noEmit lib/markdown.ts` → no errors
  - [x] Export exists: Import in REPL/test file and call `parseMarkdown('test')` → returns string

  **Commit**: YES
  - Message: `feat(markdown): add shared utility with external link handling`
  - Files: `lib/markdown.ts`

---

- [x] 2. Update blog post page to use shared utility

  **What to do**:
  - Import `parseMarkdown` from `lib/markdown`
  - Replace inline `matter()` + `marked()` calls with `parseMarkdown(post.content)`
  - Remove direct `marked` and `matter` imports (now in utility)

  **Must NOT do**:
  - NO changes to page layout or structure
  - NO changes to data fetching logic

  **Parallelizable**: YES (with 3, 4)

  **References**:
  - `app/blog/[slug]/page.tsx:1-2` - Current imports to replace
  - `app/blog/[slug]/page.tsx:15-16` - Current parsing logic to replace
  - `lib/markdown.ts` - New utility (from task 1)

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [x] Using Playwright browser:
    - Navigate to: `http://localhost:3000/blog/[any-post-with-external-link]`
    - Find external link in content
    - Verify: Arrow ↗ visible after link text
    - Action: Click external link
    - Verify: Opens in new tab
    - Inspect element: Has `target="_blank"` and `rel="noopener noreferrer"`
    - Inspect element: Contains `<span class="sr-only"> (opens in new tab)</span>`

  **Commit**: NO (groups with 3, 4)

---

- [x] 3. Update about page to use shared utility

  **What to do**:
  - Import `parseMarkdown` from `lib/markdown`
  - Replace inline `matter()` + `marked.parse()` with `parseMarkdown(aboutData.data)`
  - Remove direct `marked` and `matter` imports

  **Must NOT do**:
  - NO changes to page layout or data fetching

  **Parallelizable**: YES (with 2, 4)

  **References**:
  - `app/about/page.tsx:1-2` - Current imports to replace
  - `app/about/page.tsx:8-9` - Current parsing logic to replace
  - `lib/markdown.ts` - New utility (from task 1)

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [x] Using Playwright browser:
    - Navigate to: `http://localhost:3000/about`
    - If external links exist: verify arrow ↗ and new tab behavior
    - If no external links: verify page renders without errors

  **Commit**: NO (groups with 2, 4)

---

- [x] 4. Update contact page to use shared utility

  **What to do**:
  - Import `parseMarkdown` from `lib/markdown`
  - Replace inline `matter()` + `marked.parse()` with `parseMarkdown(contactData.data)`
  - Remove direct `marked` and `matter` imports

  **Must NOT do**:
  - NO changes to page layout or data fetching

  **Parallelizable**: YES (with 2, 3)

  **References**:
  - `app/contact/page.tsx:1-2` - Current imports to replace
  - `app/contact/page.tsx:8-9` - Current parsing logic to replace
  - `lib/markdown.ts` - New utility (from task 1)

  **Acceptance Criteria**:

  **Manual Execution Verification**:
  - [x] Using Playwright browser:
    - Navigate to: `http://localhost:3000/contact`
    - If external links exist: verify arrow ↗ and new tab behavior
    - If no external links: verify page renders without errors

  **Commit**: YES (combined with 2, 3)
  - Message: `refactor(pages): use shared markdown utility for blog/about/contact`
  - Files: `app/blog/[slug]/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`

---

- [x] 5. Final verification and regression check

  **What to do**:
  - Run build to ensure no TypeScript errors
  - Test all 3 pages render correctly
  - Verify internal links still work normally (no arrow, same tab)
  - Verify external links have all attributes

  **Parallelizable**: NO (final step)

  **References**:
  - All modified files from tasks 1-4

  **Acceptance Criteria**:

  **Build Verification**:
  - [x] `npm run build` → succeeds without errors
  - [x] `npm run lint` → no new warnings/errors

  **Manual Execution Verification**:
  - [x] Blog page: External link → new tab + arrow
  - [x] Blog page: Internal link (if any) → same tab, no arrow
  - [x] About page: Renders correctly
  - [x] Contact page: Renders correctly
  - [x] All markdown features (bold, lists, code) still work

  **Commit**: NO (no changes in this task)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(markdown): add shared utility with external link handling` | `lib/markdown.ts` | TypeScript compiles |
| 4 | `refactor(pages): use shared markdown utility for blog/about/contact` | 3 page files | `npm run build` passes |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: success
npm run lint   # Expected: no errors
```

### Final Checklist
- [x] External links open in new tab
- [x] External links have ↗ indicator
- [x] External links have "(opens in new tab)" for screen readers
- [x] External links have `rel="noopener noreferrer"`
- [x] Internal links unchanged
- [x] No code duplication (shared utility used)
- [x] Build passes
- [x] Lint passes
