# Learnings - Dark Mode Fixes

## Conventions
- Use Tailwind utility classes, no inline styles
- CSS variables follow pattern: `hsl(var(--variable-name))`
- Dark mode uses `.dark` class with `@custom-variant`

## Patterns
- Theme-aware text: `text-foreground` (high contrast) vs `text-muted-foreground` (low contrast)
- Dark mode overrides: use `.dark` selector in `@layer base`

## [2026-01-27] Completed Session

### Successful Patterns
- Tailwind `text-foreground` provides high contrast (98% brightness) in dark mode
- CSS custom properties with `hsl(var(--variable))` pattern works well
- `@layer base` for dark mode overrides maintains specificity control
- Playwright visual verification catches contrast issues effectively

### Performance
- All tasks completed in single session
- Build time: ~3s for production build
- No runtime errors or TypeScript issues
