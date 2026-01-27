# Issues - robots-sitemap-fix

## Problems & Gotchas

## CRITICAL ISSUE: Cloudflare Managed Content Injection [2026-01-27T13:02]

### Problem
Production robots.txt contains **BOTH** Cloudflare-managed content AND our app/robots.ts output.

**Line 29 still shows**: `Content-Signal: search=yes,ai-train=no`

This is injected by Cloudflare **BEFORE** our Next.js app/robots.ts content, meaning:
- Our implementation is correct and deployed ✅
- Lighthouse will still fail because Cloudflare prepends invalid directive ❌

### Evidence
```
# BEGIN Cloudflare Managed content
User-agent: *
Content-Signal: search=yes,ai-train=no  # ← Line 29 - INVALID per RFC 9309
Allow: /
# END Cloudflare Managed Content

User-Agent: GPTBot      # ← Our app/robots.ts starts here
Disallow: /
...
```

### Root Cause
Cloudflare's "Bot Fight Mode" or "Crawler Hints" feature is enabled, which automatically injects Content-Signal directives into robots.txt.

### Solution Required
**User must disable Cloudflare's managed robots.txt content**:

1. Log into Cloudflare dashboard
2. Navigate to: Website > Caching > Configuration
3. Find: "Crawler Hints" or "Managed Transforms" 
4. Disable: "Add Cloudflare-managed content to robots.txt"

OR use Cloudflare Page Rules to bypass their injection for /robots.txt

### Impact
- ✅ sitemap.xml: Working perfectly (no Cloudflare interference)
- ❌ robots.txt: Lighthouse will still report "invalid directive" error
- ✅ AI crawler blocking: Working (both Cloudflare's and ours active)

### Status
BLOCKED on Cloudflare configuration change by user.
