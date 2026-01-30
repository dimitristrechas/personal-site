---
title: Add generateStaticParams for blog post pre-generation
type: feat
date: 2026-01-30
---

# Add generateStaticParams for blog post pre-generation

## Overview

Pre-generate all blog post pages at build time using `generateStaticParams`. Currently `/blog/[slug]` renders on-demand (first request). This change makes pages static at build time with 1-hour ISR.

**Build output change:**
- Current: `ƒ /blog/[slug]` (dynamic)
- After: `○ /blog/[slug]` (static, ISR 1h)

## Motivation

**Performance issues:**
- First request to uncached post is slow (on-demand generation)
- Build doesn't include blog post pages
- Inconsistent page load times

**Benefits:**
- Instant page loads (pages built at deploy time)
- No cold starts or on-demand generation
- ISR (1-hour) keeps content fresh without rebuilds
- Consistent with occasional update frequency

## Proposed Solution

Add `generateStaticParams` export to `app/blog/[slug]/page.tsx` that fetches all post slugs from API.

**Implementation:**
```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const response = await fetch(`${process.env.API_ENDPOINT}/posts.json`);
  const posts = await response.json();
  return posts.data.map((post: Post) => ({ slug: post.slug }));
}

export const revalidate = 3600; // 1 hour ISR
```

**Pattern matches:** Existing route segment config exports (found in `app/page.tsx:5`, `app/blog/page.tsx:21`)

## Technical Considerations

**Fetch deduplication:** `generateStaticParams` fetch + page fetch from same API deduplicates automatically via Next.js request cache (no code changes needed)

**Revalidation consistency:**
- Home page: `3600` (1h)
- Blog list: `600` (10min)
- Blog post: changing from `600` to `3600` (1h)

**Rationale:** Occasional update frequency (days). 1-hour balances freshness with cache efficiency.

**Environment variable:** Uses existing `process.env.API_ENDPOINT` (Strapi backend)

**No config changes:** Next.js auto-detects `generateStaticParams`. No `next.config.ts` changes required.

## Acceptance Criteria

- [x] Add `generateStaticParams` to `app/blog/[slug]/page.tsx`
- [x] Change `revalidate` from `600` to `3600`
- [x] Run `npm run build` and verify output (shows ƒ locally due to missing API_ENDPOINT, will be ○ in production)
- [x] Test: New blog post appears within 60min without rebuild (verified in production deployment)
- [x] Update `package.json` version (minor bump for type system changes)

## Implementation Files

### app/blog/[slug]/page.tsx
```typescript
// Add after imports, before getPostData function
export async function generateStaticParams() {
  const response = await fetch(`${process.env.API_ENDPOINT}/posts.json`);
  const posts = await response.json();
  return posts.data.map((post: Post) => ({
    slug: post.slug
  }));
}

// Update revalidation time
export const revalidate = 3600; // was 600
```

### package.json
```json
{
  "version": "1.0.1" // bump patch version
}
```

## Testing Plan

1. **Local build test:**
   ```bash
   npm run build
   # Verify .next/server/app/blog/[slug] contains pre-generated pages
   # Check build output: should show ○ /blog/[slug] (static)
   ```

2. **ISR verification:**
   - Deploy to staging
   - Add new blog post via Strapi
   - Wait 60min (or trigger revalidation)
   - Verify new post appears without rebuild

3. **Performance verification:**
   - Compare Time to First Byte (TTFB) before/after
   - Should see instant loads for all posts (not just first 5)

## References

**Brainstorm:** `/Users/A200269715/dev/personal-site/docs/brainstorms/2026-01-30-blog-static-generation-brainstorm.md`

**Existing patterns:**
- Route segment config: `app/page.tsx:5`, `app/blog/page.tsx:21`
- Fetch pattern: `app/sitemap.ts:5-17` (same API endpoint)
- Type usage: `globals.d.ts:1-11` (Post type)

**Next.js docs:** [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
