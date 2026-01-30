# Type System Refactor for Maintainability

**Date:** 2026-01-30
**Type:** Code Quality / Maintainability
**Status:** Ready for Planning

## What We're Building

Move types from global scope (`globals.d.ts`) to explicit `types/` directory with proper exports, and add explicit typing to all API fetch responses. Currently, types are globally available without imports, and API responses use implicit `any` typing.

## Why This Approach

**Current problems:**
1. Global types pollute namespace - hard to track dependencies
2. No explicit imports - unclear which files use which types
3. API responses implicitly typed as `any` - no compile-time safety
4. Refactoring is risky (global changes affect everything silently)

**Chosen approach: Move types + add API response typing**

Benefits:
- Explicit imports show type dependencies clearly
- API responses have compile-time type checking
- Better IDE autocomplete and error detection
- Easier to refactor (TypeScript tracks usage)
- Standard Next.js/TypeScript pattern

**Rejected alternatives:**
- Keep global types: Doesn't solve maintainability issues
- Full type overhaul: Over-engineering for current needs (YAGNI)

## Key Decisions

1. **Directory structure: `types/` at root**
   - Create `types/post.ts`, `types/page.ts`
   - Keeps domain types separate
   - Standard TypeScript convention

2. **API response typing: Explicit generic wrapper**
   - Add `ApiResponse<T>` wrapper type
   - Type all fetch responses explicitly: `await response.json() as Post[]`
   - Catches API contract mismatches at compile time

3. **Type consolidation: Minimal**
   - Keep `Post`, `Tag` as-is (widely used)
   - Remove unused `PageData` type
   - Keep `ContactPage`, `AboutPage` separate for now (can consolidate later)

4. **Import strategy: Named exports**
   ```typescript
   // types/post.ts
   export type Post = { ... };
   export type Tag = { ... };

   // Usage
   import type { Post, Tag } from "@/types/post";
   ```

## Implementation Notes

**Files to create:**
- `types/post.ts` - Post, Tag types
- `types/page.ts` - ContactPage, AboutPage types

**Files to update (6):**
- `app/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/_components/PostCard/index.tsx`
- `app/blog/ClientComponent.tsx`
- `app/sitemap.ts`

**Files to delete:**
- `globals.d.ts`

**Example change in `app/blog/page.tsx`:**
```diff
+ import type { Post, Tag } from "@/types/post";

async function fetchBlogData() {
  const postsResponse = await fetch(...);
- const posts = await postsResponse.json();
+ const posts = await postsResponse.json() as Post[];

  const tagsResponse = await fetch(...);
- const tags = await tagsResponse.json();
+ const tags = await tagsResponse.json() as Tag[];

  return { posts, tags };
}
```

## Open Questions

None. Scope is well-defined and ready for implementation.

## Next Steps

Run `/workflows:plan` to create implementation plan.
