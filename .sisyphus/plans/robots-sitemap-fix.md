# Fix robots.txt SEO Error + Add Sitemap

## Context

### Original Request
Lighthouse SEO audit reports invalid robots.txt directive on line 29: `Content-Signal: search=yes,ai-train=no`. Fix this error and add a sitemap.

### Interview Summary
**Key Discussions**:
- `Content-Signal` is Cloudflare-proposed extension (Sept 2025), not RFC 9309 compliant
- User wants AI crawlers blocked (GPTBot, ClaudeBot, etc.)
- User wants dynamic sitemap pulling from Strapi CMS
- No existing robots.txt/sitemap in repo; current one from unknown hosting source

**Research Findings**:
- Valid robots.txt directives per RFC 9309: `user-agent`, `allow`, `disallow`, `sitemap` only
- AI crawler user-agents: GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, CCBot
- Next.js 16 supports `app/robots.ts` and `app/sitemap.ts` via MetadataRoute types

### Metis Review
**Identified Gaps** (addressed):
- API failure handling: Added try/catch with static fallback
- Revalidation strategy: Default to ISR (1 hour)
- Slug format: Confirmed matches `/blog/[slug]` pattern from existing code

---

## Work Objectives

### Core Objective
Fix Lighthouse SEO error by creating valid robots.txt with AI crawler blocking, and add dynamic sitemap for blog posts.

### Concrete Deliverables
- `app/robots.ts` - Next.js Metadata API robots file
- `app/sitemap.ts` - Dynamic sitemap fetching blog posts from Strapi

### Definition of Done
- [ ] `curl https://dimitristrechas.com/robots.txt` returns valid robots.txt (no `Content-Signal`) - BLOCKED: Cloudflare injects Content-Signal BEFORE our robots.ts content
- [ ] Lighthouse SEO audit passes (no robots.txt errors) - BLOCKED: Cloudflare Content-Signal injection will still trigger error
- [x] `curl https://dimitristrechas.com/sitemap.xml` returns XML sitemap with blog posts - VERIFIED: Working perfectly

### Must Have
- Block AI crawlers: GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, CCBot
- Allow all other crawlers
- Sitemap includes: `/`, `/about`, `/contact`, `/blog`, all blog post URLs
- Error handling if Strapi unavailable (fallback to static routes)

### Must NOT Have (Guardrails)
- No middleware.ts (adds runtime overhead, not requested)
- No modifications to existing fetch logic in other pages
- No logging/analytics for crawler behavior
- No premature abstraction (no shared fetch utilities)
- No test endpoints for robots.txt validation
- Keep AI crawler list to confirmed 7 agents only (no speculative additions)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (no test framework)
- **User wants tests**: Manual-only
- **QA approach**: Manual verification via curl + Lighthouse

---

## Task Flow

```
Task 1 (robots.ts) → Task 3 (verify)
Task 2 (sitemap.ts) → Task 3 (verify)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 1, 2 | Independent files, no dependencies |

| Task | Depends On | Reason |
|------|------------|--------|
| 3 | 1, 2 | Verification requires both files created |

---

## TODOs

- [x] 1. Create app/robots.ts with AI crawler blocking

  **What to do**:
  - Create `app/robots.ts` using Next.js MetadataRoute.Robots type
  - Block AI crawlers with individual user-agent rules
  - Allow all other crawlers with `User-agent: *`
  - Include sitemap reference to `/sitemap.xml`
  - Add comment explaining removal of `Content-Signal` directive

  **Must NOT do**:
  - No dynamic logic (environment-based rules)
  - No Crawl-delay directive (not universally supported)
  - No additional AI crawler agents beyond the 7 confirmed

  **Parallelizable**: YES (with task 2)

  **References**:

  **Pattern References**:
  - Next.js robots.ts convention: export default function returning `MetadataRoute.Robots`

  **API/Type References**:
  - `next` package: `MetadataRoute.Robots` type for return value

  **External References**:
  - RFC 9309: Valid directives are `user-agent`, `allow`, `disallow`, `sitemap`
  - AI crawler list: GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, CCBot

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [x] Run dev server: `npm run dev`
  - [x] Request: `curl http://localhost:3001/robots.txt`
  - [x] Response contains: `User-agent: GPTBot` with `Disallow: /`
  - [x] Response contains: `User-agent: *` with `Allow: /`
  - [x] Response contains: `Sitemap: https://dimitristrechas.com/sitemap.xml`
  - [x] Response does NOT contain: `Content-Signal`

  **Commit**: YES
  - Message: `feat(seo): add robots.txt with AI crawler blocking`
  - Files: `app/robots.ts`

---

- [x] 2. Create app/sitemap.ts with dynamic blog posts

  **What to do**:
  - Create `app/sitemap.ts` using Next.js MetadataRoute.Sitemap type
  - Fetch all blog posts from Strapi API using same pattern as `app/blog/page.tsx`
  - Include static routes: `/`, `/about`, `/contact`, `/blog`
  - Include dynamic routes: `/blog/[slug]` for each post
  - Add try/catch with fallback to static routes only if Strapi unreachable
  - Set ISR revalidation to 1 hour: `export const revalidate = 3600`

  **Must NOT do**:
  - No priority/changefreq attributes (optional, adds noise)
  - No extraction to shared fetch utility
  - No filtering logic beyond what API returns (assume API returns published only)

  **Parallelizable**: YES (with task 1)

  **References**:

  **Pattern References**:
  - `app/blog/page.tsx:8-11` - Fetch pattern for posts from Strapi API
  - `app/page.tsx:6-9` - Alternative fetch pattern with API_ENDPOINT

  **API/Type References**:
  - `globals.d.ts:1-11` - Post type with `slug` field for URL generation
  - `next` package: `MetadataRoute.Sitemap` type for return value

  **External References**:
  - Strapi API returns `data.data` array of Post objects
  - Site URL: `https://dimitristrechas.com`

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [x] Run dev server: `npm run dev`
  - [x] Request: `curl http://localhost:3001/sitemap.xml`
  - [x] Response is valid XML with `<urlset>` root
  - [x] Response contains: `<loc>https://dimitristrechas.com/</loc>`
  - [x] Response contains: `<loc>https://dimitristrechas.com/about</loc>`
  - [x] Response contains: `<loc>https://dimitristrechas.com/blog</loc>`
  - [x] Response contains blog post URLs: `<loc>https://dimitristrechas.com/blog/[slug]</loc>`
  - [x] Test API failure: Stop Strapi, request sitemap, verify static routes still returned

  **Commit**: YES
  - Message: `feat(seo): add dynamic sitemap with blog posts`
  - Files: `app/sitemap.ts`

---

- [x] 3. Verify fixes with Lighthouse

  **What to do**:
  - Build production site: `npm run build`
  - Run Lighthouse SEO audit on deployed/local site
  - Confirm robots.txt error is resolved
  - Confirm sitemap is accessible

  **Must NOT do**:
  - No code changes in this task
  - No additional optimizations

  **Parallelizable**: NO (depends on tasks 1, 2)

  **References**:

  **External References**:
  - Lighthouse can be run via Chrome DevTools or `npx lighthouse`

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [x] Build: `npm run build` → completes without errors
  - [x] Start: `npm start` (verified in production - site is live)
  - [ ] Run Lighthouse: Chrome DevTools > Lighthouse > SEO audit - BLOCKED: Cloudflare Content-Signal injection
  - [ ] Verify: "robots.txt is not valid" error is GONE - BLOCKED: Cloudflare injects invalid Content-Signal on line 29
  - [x] Verify: sitemap.xml is accessible and valid - VERIFIED: https://dimitristrechas.com/sitemap.xml works

  **Commit**: NO (verification only)

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(seo): add robots.txt with AI crawler blocking` | app/robots.ts | curl localhost:3001/robots.txt |
| 2 | `feat(seo): add dynamic sitemap with blog posts` | app/sitemap.ts | curl localhost:3001/sitemap.xml |

---

## Success Criteria

### Verification Commands
```bash
curl http://localhost:3001/robots.txt  # Should show AI blockers + sitemap ref
curl http://localhost:3001/sitemap.xml  # Should show XML with blog posts
npm run build  # Should complete without errors
```

### Final Checklist
- [x] robots.txt has no `Content-Signal` directive (in our app/robots.ts code - but Cloudflare injects it)
- [x] robots.txt blocks 7 AI crawlers
- [x] robots.txt allows other crawlers
- [x] sitemap.xml includes static routes
- [x] sitemap.xml includes blog posts
- [ ] Lighthouse SEO audit passes (BLOCKED: requires disabling Cloudflare Content-Signal injection)
