---
title: Move types to explicit types/ directory with API response typing
type: refactor
date: 2026-01-30
---

# Move types to explicit types/ directory with API response typing

## Overview

Refactor type system from global scope (`globals.d.ts`) to explicit `types/` directory with named exports, and add explicit typing to all API fetch responses. Improves maintainability, IDE support, and type safety.

**Scope:** 2 new files, 6 file updates, 1 file deletion

## Motivation

**Current problems:**
1. Global types pollute namespace - hard to track dependencies
2. No explicit imports - unclear which files use which types
3. API responses implicitly typed as `any` - no compile-time safety
4. Refactoring is risky (global changes affect everything silently)

**Benefits:**
- Explicit imports show type dependencies clearly
- API responses have compile-time type checking
- Better IDE autocomplete and error detection
- Easier to refactor (TypeScript tracks usage)
- Standard Next.js/TypeScript pattern

## Proposed Solution

**Phase 1:** Create `types/` directory structure
**Phase 2:** Add explicit imports to consuming files
**Phase 3:** Add API response typing
**Phase 4:** Delete `globals.d.ts`
**Phase 5:** Verify build and lint

## Technical Approach

### Phase 1: Create Types Directory

**Files to create:**

#### types/post.ts
```typescript
export type Post = {
  id: string;
  title: string;
  content: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  tags: Tag[];
  slug: string;
};

export type Tag = {
  id: string;
  title: string;
  color: string;
};
```

#### types/page.ts
```typescript
export type ContactPage = {
  data: {
    id: string;
    content: string;
    title: string;
  };
};

export type AboutPage = {
  data: {
    id: string;
    content: string;
    title: string;
  };
};
```

**Pattern:** Named exports, PascalCase types, `@/types/*` alias path

### Phase 2: Update Consuming Files (6 files)

**Import pattern (matches Biome rule `useImportType: "error"`):**
```typescript
import type { Post, Tag } from "@/types/post";
```

**Files to update:**

#### app/page.tsx
```diff
+ import type { Post } from "@/types/post";

async function fetchData() {
  const postsResponse = await fetch(`${process.env.API_ENDPOINT}/posts?sort[0]=publishedAt:desc`);
- const posts = await postsResponse.json().then((data) => data.data);
+ const posts = await postsResponse.json().then((data) => data.data) as Post[];
  return { posts: posts.slice(0, 5) };
}
```

#### app/blog/page.tsx
```diff
+ import type { Post, Tag } from "@/types/post";

async function getPosts() {
  const postsResponse = await fetch(`${process.env.API_ENDPOINT}/posts?sort[0]=publishedAt:desc`);
- const posts = await postsResponse.json().then((data) => data.data);
+ const posts = await postsResponse.json().then((data) => data.data) as Post[];

  const tagsResponse = await fetch(`${process.env.API_ENDPOINT}/tags?sort[0]=title:asc`);
- const tags = await tagsResponse.json().then((data) => data.data);
+ const tags = await tagsResponse.json().then((data) => data.data) as Tag[];

  return { posts, tags };
}
```

#### app/blog/[slug]/page.tsx
```diff
+ import type { Post } from "@/types/post";

async function getPostData(slug: string) {
  const postResponse = await fetch(`${process.env.API_ENDPOINT}/posts?filters[slug]=${slug}&populate=*`);
- const post = await postResponse.json().then((data) => data.data[0]);
+ const post = await postResponse.json().then((data) => data.data[0]) as Post;
  return post;
}
```

#### app/_components/PostCard/index.tsx
```diff
+ import type { Post } from "@/types/post";

- type PostCardProps = {
-   post: Post;
- };
+ type PostCardProps = { post: Post };
```

#### app/blog/ClientComponent.tsx
```diff
+ import type { Post, Tag } from "@/types/post";

- type BlogClientComponentProps = {
-   posts: Post[];
-   tags: Tag[];
- };
+ type BlogClientComponentProps = { posts: Post[]; tags: Tag[] };
```

#### app/sitemap.ts
```diff
+ import type { Post } from "@/types/post";

export default async function sitemap() {
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/posts?sort[0]=publishedAt:desc`);
-   const posts: Post[] = await res.json().then((data) => data.data);
+   const posts = await res.json().then((data) => data.data) as Post[];
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
    return staticRoutes;
  }
}
```

### Phase 3: Delete Global Types

**File to delete:**
```bash
rm globals.d.ts
```

### Phase 4: Verify

**Build test:**
```bash
npm run build
# Should succeed with no type errors
```

**Lint test:**
```bash
npm run lint:fix
# Should auto-fix any import formatting issues
```

## Acceptance Criteria

### Type Organization
- [x] Create `types/post.ts` with Post, Tag exports
- [x] Create `types/page.ts` with ContactPage, AboutPage exports
- [x] All type exports use PascalCase named exports

### Import Updates
- [x] `app/page.tsx` imports Post type explicitly
- [x] `app/blog/page.tsx` imports Post type explicitly
- [x] `app/blog/[slug]/page.tsx` imports Post type explicitly
- [x] `app/_components/PostCard/index.tsx` imports Post type explicitly
- [x] `app/blog/ClientComponent.tsx` imports Post type explicitly
- [x] `app/sitemap.ts` imports Post type explicitly

### API Response Typing
- [x] All fetch `.json()` calls have explicit `as Type` assertions
- [x] No implicit `any` types in fetch responses
- [x] TypeScript catches API contract mismatches at compile time

### Cleanup
- [x] Delete `globals.d.ts`
- [x] Update `package.json` version (minor bump - API changes)
- [x] `npm run build` succeeds with no errors
- [x] `npm run lint:fix` passes with no warnings

## Implementation Files

### types/post.ts (new)
```typescript
export type Post = {
  id: string;
  title: string;
  content: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  tags: Tag[];
  slug: string;
};

export type Tag = {
  id: string;
  title: string;
  color: string;
};
```

### types/page.ts (new)
```typescript
export type ContactPage = {
  data: {
    id: string;
    content: string;
    title: string;
  };
};

export type AboutPage = {
  data: {
    id: string;
    content: string;
    title: string;
  };
};
```

### package.json (update)
```json
{
  "version": "1.1.0" // minor bump - type system changes
}
```

## Testing Plan

1. **TypeScript compilation:**
   ```bash
   npm run build
   # Should succeed with no type errors
   # Verify no "implicit any" warnings
   ```

2. **IDE validation:**
   - Open each updated file in IDE
   - Verify imports resolve correctly
   - Verify autocomplete works for Post/Tag properties
   - Verify "Go to Definition" navigates to types/ directory

3. **Lint validation:**
   ```bash
   npm run lint:fix
   # Should pass with no errors
   # Biome enforces `import type` syntax automatically
   ```

4. **Runtime verification:**
   ```bash
   npm run dev
   # Visit /blog and /blog/[slug]
   # Verify no runtime errors
   # Check browser console for type-related issues
   ```

## Non-Functional Requirements

**Performance:** No runtime impact (types erased at compile time)

**Backward compatibility:** Breaking change at type level only - no runtime changes

**Code style:** Follows existing patterns:
- `import type` syntax (enforced by Biome `useImportType: "error"`)
- `@/*` path alias (existing tsconfig pattern)
- Named exports (standard TypeScript convention)

## References

**Brainstorm:** `/Users/A200269715/dev/personal-site/docs/brainstorms/2026-01-30-type-system-refactor-brainstorm.md`

**Existing patterns:**
- Type-only imports: `app/page.tsx:1`, `app/layout.tsx:1` (`import type { FC } from "react"`)
- Path alias: `tsconfig.json:16-18` (`"@/*": ["./*"]`)
- Biome enforcement: `biome.json:23` (`"useImportType": "error"`)

**Current type definitions:** `globals.d.ts:1-36`

**TypeScript docs:** [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
