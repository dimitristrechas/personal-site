---
module: System
date: 2026-01-30
problem_type: developer_experience
component: tooling
symptoms:
  - "Types in global scope without explicit imports"
  - "API responses implicitly typed as any"
  - "No IDE tracking of type dependencies"
root_cause: inadequate_documentation
resolution_type: code_fix
severity: medium
tags: [typescript, types, code-quality, maintainability, refactoring]
---

# Troubleshooting: TypeScript Global Types Causing Namespace Pollution

## Problem

Type definitions were declared globally in `globals.d.ts`, causing namespace pollution, unclear dependencies, and implicit `any` typing in API responses, making refactoring risky and IDE support suboptimal.

## Environment

- Module: System-wide
- TypeScript Version: 5
- Next.js Version: 16.1.5
- Affected Component: Type system architecture
- Date: 2026-01-30

## Symptoms

- Types (`Post`, `Tag`, `ContactPage`, `AboutPage`) available globally without imports
- No explicit indication of which files use which types
- API fetch responses implicitly typed as `any` (no compile-time safety)
- IDE "Go to Definition" navigating to `globals.d.ts` instead of proper module
- Refactoring types could break files silently (no import errors)
- Biome linter enforcing `import type` but types weren't importable

## What Didn't Work

**Direct solution:** The problem was identified during codebase analysis, and the refactor was planned and executed systematically in one pass.

## Solution

Moved types from global ambient declarations to explicit module exports in a dedicated `types/` directory, and added explicit type assertions to all API fetch responses.

**Code changes:**

```typescript
// CREATED: types/post.ts
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

// CREATED: types/page.ts
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

// UPDATED: All consuming files (6 files)
// Example: app/blog/page.tsx
import type { Post } from "@/types/post";

async function getPosts() {
  const res = await fetch(`${process.env.API_ENDPOINT}/posts?populate=%2A&sort[1]=createdAt%3Adesc`);
  // BEFORE: implicitly typed as any
  // AFTER: explicit type assertion
  return (await res.json().then((data) => data.data)) as Post[];
}

// DELETED: globals.d.ts (entire file removed)
```

**Files updated:**

1. `app/page.tsx` - Added `Post` import and type assertion
2. `app/blog/page.tsx` - Added `Post` import and type assertion
3. `app/blog/[slug]/page.tsx` - Added `Post` import and type assertion
4. `app/_components/PostCard/index.tsx` - Added `Post` import
5. `app/blog/ClientComponent.tsx` - Added `Post` import
6. `app/sitemap.ts` - Added `Post` import and type assertion

## Why This Works

**Root cause:** Ambient type declarations (`globals.d.ts` without imports) pollute the global namespace. TypeScript makes these types available everywhere, but:

1. No explicit imports means no dependency tracking
2. IDE can't show which files use which types
3. Refactoring becomes risky (changes affect all files silently)
4. API responses default to `any` without explicit typing

**Why the solution works:**

1. **Explicit module exports** (`export type`) make types importable and trackable
2. **Named imports** (`import type { Post }`) show dependencies clearly in each file
3. **Type assertions** (`as Post[]`) catch API contract mismatches at compile time
4. **Path alias** (`@/types/*`) provides clean imports via tsconfig
5. **Biome enforcement** (`useImportType: "error"`) ensures `import type` syntax consistency

**Technical details:**

- Types are now first-class modules with proper exports
- TypeScript compiler tracks usage across the codebase
- IDE "Go to Definition" navigates to proper type file
- Type-only imports are erased at runtime (no bundle size impact)
- Refactoring is safer (unused imports show as errors)

## Prevention

**To avoid this in future TypeScript projects:**

- Never use ambient type declarations for project-specific types
- Create explicit `types/` directory for domain types
- Use `export type` with named exports for all custom types
- Add `import type` at the top of every file using the types
- Enable `"strict": true` in tsconfig.json
- Use linter rules to enforce explicit imports (`useImportType: "error"`)
- Add type assertions to all API fetch responses for compile-time safety

**Best practices:**

```typescript
// ✅ GOOD: Explicit module with named exports
// types/post.ts
export type Post = { ... };

// app/page.tsx
import type { Post } from "@/types/post";
const posts = await fetch(...).then(r => r.json()) as Post[];

// ❌ BAD: Global ambient declaration
// globals.d.ts
type Post = { ... };

// app/page.tsx
// (no import, implicitly available)
const posts = await fetch(...).then(r => r.json());
```

**Early detection:**

- Check for `globals.d.ts` or `*.d.ts` files with type declarations
- Look for types used without imports
- Run TypeScript in strict mode to catch implicit `any` types
- Use IDE "Find All References" - if it doesn't work, types aren't properly imported

## Related Issues

No related issues documented yet.
