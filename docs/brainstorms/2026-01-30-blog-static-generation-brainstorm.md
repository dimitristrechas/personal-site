# Blog Static Generation Performance Optimization

**Date:** 2026-01-30
**Type:** Performance Improvement
**Status:** Ready for Planning

## What We're Building

Pre-generate all blog post pages at build time using Next.js `generateStaticParams` instead of on-demand rendering. Currently, blog detail pages (`/blog/[slug]`) render on first request. This change makes them static at build time while maintaining ISR for occasional updates.

## Why This Approach

**Current state:**
- Blog posts use dynamic routing but no `generateStaticParams`
- Pages generate on-demand on first request
- Causes slower initial page loads for uncached posts
- Build doesn't include blog post pages

**Chosen approach: Static generation + ISR (1-hour)**

Benefits:
- All blog posts pre-built at deploy time
- Instant page loads (no on-demand generation)
- Simpler deployment (no cold starts)
- ISR keeps content fresh without rebuilds
- Consistent with occasional update frequency

**Rejected alternatives:**
- Pure on-demand (current): Slower first loads
- No revalidation (pure static): Requires rebuild for updates
- 10-minute ISR: Over-fetches for occasional updates

## Key Decisions

1. **Revalidation time: 1 hour**
   - Balances freshness with cache efficiency
   - Matches home page revalidation for consistency
   - Updates appear within 60min without rebuild

2. **Fetch strategy: Shared with blog list**
   - Both `/blog` and `/blog/[slug]` fetch from same API
   - Next.js request cache automatically deduplicates
   - No code changes needed for deduplication

3. **Error handling: Defer to separate task**
   - Focus on static generation first
   - Missing post handling (404) is separate concern
   - Error boundaries are code quality, not performance

## Implementation Notes

**Target file:** `app/blog/[slug]/page.tsx`

Add:
```typescript
export async function generateStaticParams() {
  const response = await fetch('http://localhost:4321/api/posts.json');
  const posts = await response.json();
  return posts.map((post) => ({ slug: post.slug }));
}

export const revalidate = 3600; // 1 hour
```

**Build impact:**
- Current: `ƒ /blog/[slug]` (dynamic)
- After: `○ /blog/[slug]` (static, ISR 1h)

**No config changes needed:**
- Next.js auto-detects `generateStaticParams`
- ISR works with existing setup
- No `next.config.ts` changes required

## Open Questions

None. Design is complete and ready for implementation.

## Next Steps

Run `/workflows:plan` to create implementation plan.
