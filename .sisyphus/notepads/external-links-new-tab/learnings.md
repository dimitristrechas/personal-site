# External Links New Tab - Learnings

## marked.use() Configuration Pattern

The custom link renderer is configured via `marked.use()` with a `renderer` object. The renderer method signature is:

```typescript
link(token) {
  // token.href: string (the URL)
  // token.title: string | null (optional title attribute)
  // token.tokens: Token[] (inline tokens for link text)
  // this.parser.parseInline(token.tokens): string (renders link text)
}
```

Key observations:
- Must use `this.parser.parseInline(token.tokens)` to render nested markdown in link text
- `marked()` is async in v17 (returns Promise<string>)
- Custom renderer is called during parsing and returns HTML string

## External Link Detection

Pattern: `href.startsWith("http://") || href.startsWith("https://")`
- Catches all absolute URLs
- Leaves relative paths, anchors, and special links (mailto, tel) untouched

## Accessibility Pattern

Implemented as:
```html
<a href="..." target="_blank" rel="noopener noreferrer">
  text↗<span class="sr-only"> (opens in new tab)</span>
</a>
```

- Arrow ↗ is inside the anchor tag (fully clickable)
- sr-only span adds screen reader text
- rel="noopener noreferrer" for security

## Integration Notes

The `parseMarkdown()` function:
- Accepts markdown string with frontmatter (gray-matter)
- Returns Promise<string> due to marked's async nature
- Must be awaited when used in components
- Returns plain HTML (no component wrapper)

## TypeScript Compilation

Project uses `esModuleInterop: true` in tsconfig.json, allowing default imports:
```typescript
import matter from "gray-matter";  // ✓ Works
```

Verification: `npx tsc --noEmit` passes cleanly.

## Browser Verification - Manual Testing (Jan 27, 2026)

### Test Environment
- Dev server: http://localhost:3001
- Test page created: `/test-external-links` with markdown containing:
  - External links to Google, Next.js, example.com, GitHub
  - Internal link to `/blog`

### Verification Results

**✅ Blog posts: External links render with arrow ↗**
- All external links display with arrow inside anchor text
- Confirmed in HTML via browser evaluation
- Arrow is part of link text, fully clickable

**✅ Blog posts: target="_blank" present**
- HTML inspection confirms: `<a href="..." target="_blank">`
- All external links have the attribute

**✅ Blog posts: rel="noopener noreferrer" present**
- HTML inspection confirms: `rel="noopener noreferrer"`
- All external links properly secured

**✅ Blog posts: sr-only span present**
- HTML inspection confirms: `<span class="sr-only"> (opens in new tab)</span>`
- Accessibility text present in all external links

**✅ Blog posts: Opens in new tab when clicked**
- Clicked external link to Google
- New tab opened (verified via browser tabs)
- Current page remained on test page (not navigated away)
- target="_blank" working correctly

**✅ Internal links: No arrow, same tab (regression check)**
- Clicked internal link to `/blog`
- Link navigated in SAME TAB (URL changed to http://localhost:3001/blog)
- No new tab opened
- No arrow in internal link text
- Internal links unaffected by external link changes

**✅ About page: Renders correctly**
- Navigated to `/about`
- Page renders without errors
- No console errors related to link rendering

**✅ Contact page: Renders correctly**
- Navigated to `/contact`
- Page renders without errors
- No console errors related to link rendering

**✅ Build: npm run build succeeds**
- Production build completed successfully
- TypeScript compilation passed
- All pages generated
- No errors in build output

**✅ Lint: npm run lint succeeds**
- ESLint check passed
- No linting errors detected
- Code quality maintained

### HTML Structure Verification

External link HTML (Google):
```html
<a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
  external link to Google↗<span class="sr-only"> (opens in new tab)</span>
</a>
```

External link with title attribute (example.com):
```html
<a href="https://example.com" title="Example Site" target="_blank" rel="noopener noreferrer">
  link with title↗<span class="sr-only"> (opens in new tab)</span>
</a>
```

Internal link HTML:
```html
<a href="/blog">local link</a>
```

### Key Observations
1. Arrow ↗ is INSIDE the anchor tag - entire link is clickable
2. sr-only text is hidden from visual display but readable by screen readers
3. Title attribute is preserved for external links
4. Internal links have clean, simple HTML (no extra attributes)
5. Implementation correctly differentiates external (http://, https://) from internal URLs
6. No regressions - all pages render without errors

## [2026-01-27] Plan Completion Summary

### Work Completed
All 5 tasks executed successfully:
1. Created `lib/markdown.ts` with custom marked renderer
2. Updated blog post page to use shared utility
3. Updated about page to use shared utility
4. Updated contact page to use shared utility
5. Full verification via Playwright browser testing

### Technical Implementation
- **marked v17.0.1** token-based renderer API
- External link detection: `href.startsWith("http://") || href.startsWith("https://")`
- Custom renderer adds: `target="_blank"`, `rel="noopener noreferrer"`, arrow ↗, sr-only span
- Shared utility eliminates code duplication across 3 pages

### Commits
1. `feat(markdown): add shared utility with external link handling` (666d64d)
2. `refactor(pages): use shared markdown utility for blog/about/contact` (a0ff313)

### Verification Results
✅ Build passes (npm run build)
✅ Lint passes (npm run lint)
✅ External links open in new tab
✅ Visual indicator (arrow ↗) present inside links
✅ Accessibility text via sr-only span
✅ Security attributes (rel="noopener noreferrer")
✅ Internal links unchanged (no regression)
✅ All markdown features preserved (bold, lists, code)

### Key Learnings
- TypeScript import with marked requires esModuleInterop (already configured in tsconfig)
- marked.use() configuration is global - applies to all marked() calls
- Title attribute handling requires conditional logic in custom renderer
- sr-only span approach more robust than aria-label for screen readers
- Playwright browser testing essential for visual/behavioral verification
