# Asset Performance Optimization

## Context

### Original Request
Performance audit of site focusing on images and fonts. Implement optimizations found.

### Audit Findings
- **Image**: `headshot-compressed.jpg` (3000×2000, 80KB) displayed at 128×128px in hero
  - Uses `next/image` but missing `priority` prop (above-the-fold LCP issue)
  - Source massively oversized for display size
- **Fonts**: No custom fonts. System font stack via Tailwind defaults.
- **Config**: `next.config.ts` empty (using Next.js defaults)

### Metis Review
- Confirmed image in `public/headshot-compressed.jpg`
- Identified need to maintain square aspect for `rounded-full` CSS
- Flagged scope creep risks around responsive images, format conversion

---

## Work Objectives

### Core Objective
Optimize hero image for LCP by adding priority and resizing source file.

### Concrete Deliverables
- Updated `app/page.tsx` with `priority` prop on hero image
- Resized `public/headshot-compressed.jpg` (256×256 or 512×512 for retina)

### Definition of Done
- [ ] Hero image loads with `priority` (no lazy loading)
- [ ] Source image ≤20KB (currently 80KB)
- [ ] No visual regression (same appearance, rounded, centered)
- [ ] `npm run build` passes

### Must Have
- `priority` prop on hero Image component
- Resized/optimized source image

### Must NOT Have (Guardrails)
- NO changes to other pages/components
- NO responsive srcset (not measured as problem)
- NO image format conversion (WebP/AVIF)
- NO font loading changes (system fonts acceptable)
- NO `next.config.ts` modifications
- NO additional image optimization libraries
- NO blur placeholder additions

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (no test setup per AGENTS.md)
- **User wants tests**: Manual-only
- **Framework**: none

### Manual QA Procedures
Each task verified via build + visual inspection + network tab.

---

## Task Flow

```
Task 1 (add priority) → Task 2 (resize image)
```

Sequential: Task 2 can start immediately, but both modify hero section.

## Parallelization

| Task | Depends On | Reason |
|------|------------|--------|
| 1 | none | Code change only |
| 2 | none | Asset change only |

Tasks are independent but grouped in single commit.

---

## TODOs

- [ ] 1. Add `priority` prop to hero image

  **What to do**:
  - Open `app/page.tsx`
  - Add `priority` prop to Image component (line 22-29)
  - Remove any conflicting `loading` prop if present (none currently)

  **Must NOT do**:
  - Add placeholder or blurDataURL
  - Modify sizes/srcset
  - Touch any other Image components

  **Parallelizable**: YES (with 2)

  **References**:
  - `app/page.tsx:22-29` - Current Image component, add priority here
  - Next.js docs: priority prop signals above-the-fold, disables lazy loading

  **Acceptance Criteria**:
  - [ ] `priority` prop present on Image component
  - [ ] `npm run build` passes
  - [ ] `npm run dev` → inspect Network tab → image loads immediately (no lazy)
  - [ ] Visual: hero image appears same as before

  **Commit**: NO (groups with 2)

- [ ] 2. Resize headshot image to 512×512

  **What to do**:
  - Resize `public/headshot-compressed.jpg` from 3000×2000 to 512×512
  - Maintain JPEG format
  - Crop to square (center crop) to match rounded-full display
  - Target: ≤20KB file size
  - Use any image tool (sips, ImageMagick, online tool)

  **Must NOT do**:
  - Convert to WebP/AVIF
  - Create multiple sizes
  - Rename file (keep same path for cache continuity)

  **Parallelizable**: YES (with 1)

  **References**:
  - `public/headshot-compressed.jpg` - Current file (3000×2000, 80KB)
  - `app/page.tsx:24` - src path must remain `/headshot-compressed.jpg`
  - CSS: `rounded-full` requires square image for proper circle

  **Acceptance Criteria**:
  - [ ] Image dimensions: 512×512px (or 256×256 acceptable)
  - [ ] File size: ≤20KB
  - [ ] `file public/headshot-compressed.jpg` → JPEG format confirmed
  - [ ] `npm run dev` → hero displays correctly (no stretch/distortion)
  - [ ] Visual: rounded-full circle appears correctly

  **Commit**: YES (includes task 1)
  - Message: `perf: optimize hero image for LCP`
  - Files: `app/page.tsx`, `public/headshot-compressed.jpg`
  - Pre-commit: `npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 2 | `perf: optimize hero image for LCP` | app/page.tsx, public/headshot-compressed.jpg | npm run build |

---

## Success Criteria

### Verification Commands
```bash
npm run build          # Expected: success, no errors
npm run dev            # Expected: site runs
# Browser: Open http://localhost:3000
# Network tab: headshot loads immediately (priority)
# Visual: hero image appears as rounded circle
```

### Final Checklist
- [ ] `priority` prop on hero Image
- [ ] Source image ≤20KB
- [ ] No visual regression
- [ ] Build passes
- [ ] NO changes to fonts, other pages, or config files
