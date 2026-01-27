# PERS-16: Image Lighthouse Optimization

## Context

### Original Request
Improve Lighthouse image performance by adding srcset and proper width/height attributes. Linear issue PERS-16, GitHub issue #30.

### Interview Summary
**Key Discussions**:
- Single image in codebase: `app/page.tsx` (headshot in hero section)
- Current implementation lacks `sizes` prop → only 1x/2x srcset generated
- Redundant inline style duplicates width/height props
- Missing `priority` attribute for above-fold image
- Empty next.config.ts with no image optimization config

**Research Findings**:
- Next.js docs: without `sizes`, only limited srcset (1x, 2x)
- With `sizes`, full srcset (640w, 750w, etc.) generated
- `priority` preloads image, improving LCP

### Metis Review
**Identified Gaps** (addressed):
- Verification method: Added `npm run build` check
- Scope boundary: Locked to app/page.tsx only, CMS images excluded
- next.config.ts changes: Marked as optional

---

## Work Objectives

### Core Objective
Optimize the hero headshot image for Lighthouse performance by enabling proper srcset generation and preloading.

### Concrete Deliverables
- Modified `app/page.tsx` Image component with `sizes` and `priority` props
- Removed redundant inline style

### Definition of Done
- [x] `npm run build` passes
- [x] Image component has `sizes="128px"` and `priority` props
- [x] Inline `style` prop removed from Image component
- [x] No Lighthouse "Properly size images" warning for headshot

### Must Have
- `sizes="128px"` prop on Image component
- `priority` prop on Image component
- Existing `src`, `alt`, `width`, `height` values preserved exactly

### Must NOT Have (Guardrails)
- Changes to any file except `app/page.tsx`
- Modifications to image dimensions (keep 128×128)
- Changes to surrounding JSX structure
- New dependencies
- CMS/blog image optimizations (separate scope)
- Code comments explaining the changes
- next.config.ts changes (unless explicitly requested)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (ESLint, build checks)
- **User wants tests**: Manual verification
- **Framework**: Manual QA via build + Lighthouse

### Manual QA Approach
Each task includes build verification and optional Lighthouse check.

---

## Task Flow

```
Task 1 (single task - atomic change)
```

## Parallelization

| Task | Parallelizable | Notes |
|------|----------------|-------|
| 1 | N/A | Single task |

---

## TODOs

- [x] 1. Optimize Image component props

  **What to do**:
  - Add `sizes="128px"` prop to Image component
  - Add `priority` prop to Image component
  - Remove `style={{ width: "128px", height: "128px" }}` prop

  **Must NOT do**:
  - Change `src`, `alt`, `width`, or `height` values
  - Modify className or other existing props
  - Touch any other components or files
  - Add comments

  **Parallelizable**: N/A (single task)

  **References**:

  **File to modify**:
  - `app/page.tsx:22-29` - Current Image component implementation

  **Pattern to follow** (from Next.js docs):
  ```tsx
  <Image
    src="/example.png"
    alt="description"
    width={128}
    height={128}
    sizes="128px"
    priority
  />
  ```

  **Expected result**:
  ```tsx
  <Image
    className="rounded-full bg-red-200 object-cover p-0.25"
    src="/headshot-compressed.jpg"
    alt="a headshot of the author"
    width={128}
    height={128}
    sizes="128px"
    priority
  />
  ```

  **Acceptance Criteria**:

  **Build Verification (REQUIRED)**:
  - [x] `npm run build` → exits with code 0, no errors
  - [x] No TypeScript errors related to Image component

  **Code Verification**:
  - [x] Image component has `sizes="128px"` prop
  - [x] Image component has `priority` prop (no value, boolean)
  - [x] No `style` prop on Image component
  - [x] All original props preserved (`className`, `src`, `alt`, `width`, `height`)

  **Optional Lighthouse Verification**:
  - [x] `npm run dev` → server running on localhost:3000
  - [x] Using browser: Navigate to http://localhost:3000
  - [x] Run Lighthouse (DevTools > Lighthouse > Performance)
  - [x] Verify: No "Properly size images" warning for headshot
  - [x] Verify: LCP improved or unchanged

  **Commit**: YES
  - Message: `perf(image): add srcset sizes and priority for lighthouse`
  - Files: `app/page.tsx`
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `perf(image): add srcset sizes and priority for lighthouse` | app/page.tsx | npm run build |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: exit 0, no errors
npm run lint   # Expected: no new warnings
```

### Final Checklist
- [x] `sizes="128px"` prop present
- [x] `priority` prop present
- [x] Inline `style` removed
- [x] Build passes
- [x] Only app/page.tsx modified
