---
module: Blog System
date: 2026-01-30
problem_type: performance_issue
component: frontend_stimulus
symptoms:
  - "Blog post pages rendering on-demand (ƒ) instead of statically (○)"
  - "Slow first page loads for uncached posts"
  - "Build not including blog post pages"
root_cause: config_error
resolution_type: code_fix
severity: medium
tags: [nextjs, static-generation, isr, generatestaticparams, performance]
---

# Troubleshooting: Next.js Dynamic Routes Not Pre-Generating at Build Time

## Problem

Blog post pages (`/blog/[slug]`) were rendering on-demand on first request instead of being pre-generated at build time, causing slow initial page loads and inconsistent performance.

## Environment

- Module: Blog System
- Next.js Version: 16.1.5
- React Version: 19.2.4
- Affected Component: Blog detail page (`app/blog/[slug]/page.tsx`)
- Date: 2026-01-30

## Symptoms

- Build output showing `ƒ /blog/[slug]` (dynamic) instead of `○ /blog/[slug]` (static)
- First request to uncached blog posts had slower load times
- No pre-generated pages in `.next/server/app/blog/[slug]/` directory
- Inconsistent page load performance across different posts

## What Didn't Work

**Direct solution:** The problem was identified during analysis as missing `generateStaticParams` export, and fixed on the first attempt.

## Solution

Added `generateStaticParams` export to the dynamic route page to pre-generate all blog post pages at build time.

**Code changes:**

```typescript
// app/blog/[slug]/page.tsx

// ADDED: generateStaticParams export
export async function generateStaticParams() {
  const response = await fetch(`${process.env.API_ENDPOINT}/posts?populate=%2A&sort[1]=createdAt%3Adesc`);
  const data = await response.json();
  const posts = (data.data || []) as Post[];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// UPDATED: Revalidation time for consistency
export const revalidate = 3600; // was 600 (10min), now 1hr
```

**Additional changes:**

- Updated revalidation time from 600 seconds (10 min) to 3600 seconds (1 hour) for consistency with home page
- Ensured API endpoint matches the pattern used in sitemap.ts for consistency

## Why This Works

**Root cause:** Next.js App Router with dynamic routes (`[slug]`) defaults to on-demand rendering unless you explicitly export `generateStaticParams`. Without this export, pages are generated only when first requested.

**Why the solution works:**

1. `generateStaticParams` tells Next.js which dynamic route parameters to pre-generate at build time
2. Fetching all post slugs from the API during build provides the list of pages to generate
3. ISR (Incremental Static Regeneration) with `revalidate: 3600` keeps content fresh without rebuilding
4. Next.js automatically deduplicates fetch requests, so `generateStaticParams` fetch + page fetch don't cause redundant API calls

**Technical details:**

- Next.js detects `generateStaticParams` automatically - no `next.config.ts` changes needed
- Build output changes from `ƒ` (dynamic) to `○` (static with ISR)
- All blog posts are built at deploy time, eliminating cold starts
- Revalidation strategy (1 hour) balances freshness with cache efficiency for occasional updates

## Prevention

**To avoid this in future Next.js projects:**

- Always add `generateStaticParams` to dynamic routes that should be pre-rendered
- Check build output for `ƒ` symbols - these indicate on-demand rendering
- For routes with known parameters (like blog posts from a CMS), prefer static generation over on-demand
- Use consistent revalidation times across related routes (home, list, detail pages)
- Document ISR strategy in comments: `export const revalidate = 3600; // 1 hour ISR`

**Early detection:**

- Run `npm run build` and inspect the route table output
- Look for `○` (static) vs `ƒ` (dynamic) symbols
- Check `.next/server/app/[route]/` for pre-generated files
- For local builds without API access, pages may still show as dynamic - verify in production/staging

## Related Issues

No related issues documented yet.
