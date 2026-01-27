# Decisions - Dark Mode Fixes

## Architectural Choices
- Use existing CSS variable system (no new variables)
- Override prose typography in global.css, not inline
- Keep all existing spacing/layout intact

## [2026-01-27] Final Decisions

### Theme Implementation
- Used `next-themes` library (industry standard, 20KB)
- CSS-based theming with `.dark` class selector
- Avoided JavaScript color manipulation

### Commit Strategy
- 3 atomic commits (theme setup, visibility fixes, styling)
- Followed semantic commit convention
- Version bumped to 2.3.0
