# ShadCN-Compatible Theming + Dark Mode Implementation

## Context

### Original Request
Linear issues PERS-18 (Add ShadCN) + PERS-17 (Implement dark mode). Combined into single plan for cohesive theming infrastructure.

### Scope Clarification: What "Add ShadCN" Means Here
**This plan implements ShadCN-COMPATIBLE CSS token infrastructure, NOT full ShadCN CLI installation.**

What we ARE doing:
- Adopting ShadCN's CSS variable naming convention (`--background`, `--foreground`, etc.)
- Using ShadCN's two-step CSS pattern (`:root` vars → `@theme` mapping)
- Making the codebase ready for future `shadcn add` commands if desired

What we are NOT doing:
- Running `npx shadcn init` or `npx shadcn add`
- Creating `components.json` file
- Installing any shadcn CLI or components
- Adding the full ShadCN token palette (only 5 essential tokens)

**Rationale**: PERS-18 says "Add ShadCN or BaseUI - investigate skeleton components". This plan establishes the foundational theming layer that makes future ShadCN component adoption seamless, without the bloat of unused components today.

### Interview Summary
**Key Discussions**:
- CSS Architecture: ShadCN two-step pattern (`:root` vars → `@theme` mapping) for future component compatibility
- Toggle: Native button (no ShadCN component dependencies, 90% less code)
- Tag colors: Keep fixed (CMS-provided hex colors ignore dark mode)
- FOUC: Zero flash via `next/script` with `strategy="beforeInteractive"` (per Next.js docs)

**Research Findings**:
- Tailwind v4 uses `@custom-variant dark` in CSS (no config file)
- `@theme inline` BREAKS runtime dark mode (bakes values at build time) - must use regular `@theme`
- `next-themes` is standard for Next.js dark mode with SSR safety
- ShadCN two-step CSS pattern: bare HSL values in `:root` → wrap with `hsl()` in `@theme`
- Repo uses Next.js 16.1.5 with React 19 (note: AGENTS.md incorrectly says "Next.js 15" - outdated)

### Metis Review
**Identified Gaps** (addressed):
- `@theme inline` conflict: Using regular `@theme` with `hsl()` wrapper
- Border color change: Tailwind v4 default is `currentColor` - will add explicit colors
- Typography dark mode: Will test `prose dark:prose-invert`

### Current Codebase State (verified)
**CSS file**: `app/global.css` (NOT `globals.css`)
- Current contents (lines 1-3):
  ```css
  @import "tailwindcss";
  @plugin "@tailwindcss/typography";
  ```
- File imported in `app/layout.tsx:6` as `import "./global.css";`
- **Note**: AGENTS.md incorrectly references `app/globals.css` and "Next.js 15" - both are outdated. **Authoritative source**: Implementation uses `app/global.css` (verified via import in `app/layout.tsx:6`) and Next.js 16.1.5 (verified in `package.json`). Ignore AGENTS.md for these items.

**Verified existing files** (all paths confirmed via glob/read):
- `app/global.css` - CSS file to edit (**NOTE: Only edit this file. Ignore AGENTS.md mention of `globals.css`**)
- `app/layout.tsx` - root layout
- `app/_components/Header/index.tsx` - Header component (in folder)
- `app/_components/Footer/index.tsx` - Footer component (in folder)
- `app/_components/PostCard/index.tsx` - PostCard component (in folder)
- `app/blog/[slug]/page.tsx` - blog post page (square brackets are literal folder name in Next.js App Router dynamic routes)

**Tailwind config**: NO `tailwind.config.*` file exists (confirmed via glob search)
- Project uses Tailwind v4 CSS-first configuration only
- All config done in CSS via `@plugin`, `@theme`, `@custom-variant` directives

**Layout structure**: `app/layout.tsx` has no explicit `<head>` tag
- Next.js App Router auto-generates `<head>` from metadata
- FOUC script will use `next/script` with `strategy="beforeInteractive"` (Next.js auto-injects into `<head>`)
- Analytics `<Script>` is currently a sibling of `<body>` inside `<html>` (search for `process.env.NODE_ENV === "production"`) - will remain unchanged

---

## Work Objectives

### Core Objective
Add ShadCN-compatible CSS token infrastructure with dark mode toggle. Scope limited to 5 tokens sufficient for Header, Footer, PostCard, and body theming.

### Token Scope (EXPLICIT)
Only these 5 CSS tokens will be created and used:
- `background` / `--color-background` - page background
- `foreground` / `--color-foreground` - primary text
- `muted` / `--color-muted` - subtle backgrounds (unused in current scope but included for completeness)
- `muted-foreground` / `--color-muted-foreground` - secondary text (dates, subtitles)
- `border` / `--color-border` - border colors

**Component token mapping**:
| Component | Current | New Token |
|-----------|---------|-----------|
| body | (no bg color) | `bg-background text-foreground` |
| Header title | `text-slate-600` | `text-muted-foreground` |
| Header nav links | `text-gray-800` | `text-foreground` |
| PostCard title | `text-gray-800` | `text-foreground` |
| PostCard date | (no color) | `text-muted-foreground` |
| PostCard border | `border-b-1` (invalid) | `border-b border-border` |
| Footer text | (no color) | `text-foreground` |

### Concrete Deliverables
- `next-themes` dependency installed
- `app/global.css` with complete theme CSS variables (light/dark)
- `app/_components/ThemeProvider.tsx` (client wrapper)
- `app/_components/ThemeToggle.tsx` (native button with sun/moon)
- `app/layout.tsx` updated with ThemeProvider + FOUC prevention script
- Header with theme toggle button
- All components updated to use semantic theme colors

### Definition of Done
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] Dark mode persists across refresh (localStorage)
- [ ] Zero FOUC on initial load
- [ ] All pages render correctly in both themes

### Must Have
- ShadCN two-step CSS pattern
- Zero flash dark mode
- Native toggle button (no ShadCN component)
- System preference support via `next-themes`

### Must NOT Have (Guardrails)
- `@theme inline` (breaks runtime theme switching)
- ShadCN component installation (`shadcn add`)
- OKLCH colors (stick to HSL for simplicity)
- Custom animations beyond toggle icon transition
- Changes to font sizes, weights, or typography settings
- Tag color modifications (keep CMS-provided colors)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (no test framework installed)
- **User wants tests**: Manual-only (per project setup)
- **Framework**: none

### Manual QA Only
Each TODO includes verification via browser and terminal.

---

## Task Flow

```
Task 0 (dependency) → Task 1 (CSS) → Task 2 (ThemeProvider) → Task 3 (ThemeToggle)
                                            ↓
                                      Task 4 (Layout) → Task 5 (Header) → Task 6 (Components) → Task 7 (QA)
```

## Parallelization

| Task | Depends On | Reason |
|------|------------|--------|
| 1 | 0 | Sequential flow (install before CSS) - not technically required but cleaner |
| 2 | 1 | Provider uses CSS variable system |
| 3 | 1 | Toggle uses theme colors |
| 4 | 2 | Layout imports ThemeProvider |
| 5 | 3, 4 | Header imports ThemeToggle |
| 6 | 1 | Components use theme variables |
| 7 | ALL | QA after everything |

---

## TODOs

- [ ] 0. Install next-themes dependency

  **What to do**:
  - Run `npm install next-themes`
  - Verify package added to `package.json`

  **Must NOT do**:
  - Install any other packages
  - Modify package.json manually

  **Parallelizable**: NO (first task)

  **References**:
  - `package.json` dependencies section (search for `"dependencies": {`). Current state:
    ```json
    "dependencies": {
      "@tailwindcss/postcss": "^4.1.18",
      "gray-matter": "^4.0.3",
      "marked": "^17.0.1",
      "next": "16.1.5",
      "react": "^19.2.4",
      "react-dom": "^19.2.4"
    }
    ```
  - Note: Repo uses Next.js 16.1.5 (not 15 as mentioned in some docs - Next 16 is the current major version)

  **Acceptance Criteria**:
  - [ ] `npm install next-themes` exits with code 0
  - [ ] `package.json` contains `"next-themes"` in dependencies
  - [ ] `package-lock.json` updated (verify file changed)
  - [ ] `npm run build` still succeeds after install

  **Commit**: YES
  - Message: `chore: add next-themes for dark mode`
  - Files: `package.json`, `package-lock.json` (both updated by npm install)

---

- [ ] 1. Setup theme CSS variables in `app/global.css`

  **What to do**:
  - Edit `app/global.css` (NOT `globals.css` - see note below)
  - Add `@custom-variant dark (&:where(.dark, .dark *))` for Tailwind v4
  - Add `:root` CSS variables with bare HSL values (light theme)
  - Add `.dark` CSS variables (dark theme)
  - Add `@theme` block mapping variables to Tailwind utilities
  - Keep existing `@import "tailwindcss"` and `@plugin` lines

  **Tailwind v4 utility class naming** (from ShadCN docs - https://ui.shadcn.com/docs/tailwind-v4):
  - `--color-background` in `@theme` → creates `bg-background` utility class
  - `--color-foreground` → creates `text-foreground` utility class
  - `--color-border` → creates `border-border` utility class
  - The `--color-` prefix is what tells Tailwind to generate color utilities
  - ShadCN docs confirm this pattern: `@theme { --color-background: var(--background); }` produces `bg-background`

  **Fallback if utility names differ**: If utilities are generated as `bg-color-background` instead of `bg-background`, update all classnames accordingly (search/replace `bg-background` → `bg-color-background`, etc.)

  **CSS structure** (preferred approach with `@layer base`):
  ```css
  @import "tailwindcss";
  @plugin "@tailwindcss/typography";
  
  @custom-variant dark (&:where(.dark, .dark *));
  
  @layer base {
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 3.9%;
      --muted: 0 0% 96.1%;
      --muted-foreground: 0 0% 45.1%;
      --border: 0 0% 89.8%;
    }
    .dark {
      --background: 0 0% 3.9%;
      --foreground: 0 0% 98%;
      --muted: 0 0% 14.9%;
      --muted-foreground: 0 0% 63.9%;
      --border: 0 0% 14.9%;
    }
  }
  
  @theme {
    --color-background: hsl(var(--background));
    --color-foreground: hsl(var(--foreground));
    --color-muted: hsl(var(--muted));
    --color-muted-foreground: hsl(var(--muted-foreground));
    --color-border: hsl(var(--border));
  }
  ```

  **Fallback if `@layer base` causes build errors**:
  ```css
  @import "tailwindcss";
  @plugin "@tailwindcss/typography";
  
  @custom-variant dark (&:where(.dark, .dark *));
  
  :root {
    --background: 0 0% 100%;
    /* ... same vars ... */
  }
  .dark {
    --background: 0 0% 3.9%;
    /* ... same vars ... */
  }
  
  @theme {
    --color-background: hsl(var(--background));
    /* ... same mappings ... */
  }
  ```

  **Must NOT do**:
  - Use `@theme inline` (breaks runtime theming)
  - Add OKLCH colors
  - Add more than 5 color tokens (background, foreground, muted, muted-foreground, border)
  - Modify typography plugin settings

  **Troubleshooting if `bg-background` class not generated**:
  1. Verify `@theme { --color-background: ... }` exists in CSS (the `--color-` prefix is what creates the utility)
  2. Verify `@import "tailwindcss";` appears BEFORE the `@theme` block
  3. Clear Next.js cache: `rm -rf .next && npm run dev`
  4. If still not working, check Tailwind v4 docs for `@theme` syntax changes

  **Parallelizable**: NO (foundational CSS must exist before components use theme colors)

  **Note on Task 0 dependency**: Task 1 does not technically depend on `next-themes` installation (the `.dark` class in CSS is independent of next-themes APIs). We sequence 0→1 for cleaner workflow, not technical necessity.

  **References**:
  - `app/global.css:1-3` - current file (exact path: `app/global.css`, NOT `globals.css`)
  - ShadCN Tailwind v4 docs: https://ui.shadcn.com/docs/tailwind-v4 (two-step CSS pattern section)

  **Acceptance Criteria**:
  - [ ] `app/global.css` contains `@custom-variant dark`
  - [ ] `app/global.css` contains `:root` block with 5 CSS variables
  - [ ] `app/global.css` contains `.dark` block with same 5 variables
  - [ ] `app/global.css` contains `@theme` block mapping to `hsl(var(--...))`
  - [ ] `npm run build` succeeds with NO CSS directive errors
  - [ ] No `@theme inline` anywhere in file

  **Tailwind v4 directive verification** (CRITICAL - run immediately after Task 1):
  Run `npm run build` after saving CSS changes. Expected outcome: build succeeds.
  
  If build fails with CSS directive errors:
  - If `@layer base` not recognized: Use the fallback CSS structure above (`:root` and `.dark` at top level without `@layer base` wrapper)
  - If `@custom-variant` not recognized: Verify Tailwind v4.1+ installed (`package.json` shows `^4.1.18` - should work)
  - If `@theme` not recognized: This is the core Tailwind v4 theming directive, update package if needed

  **Proof step**: After Task 1, run `npm run build` and confirm success before proceeding to Task 2. This validates the directive compatibility with this repo's PostCSS pipeline.

  **Utility generation verification** (run after build succeeds):
  1. Run `npm run dev`
  2. Open http://localhost:3000 in browser
  3. Inspect `<body>` element in DevTools
  4. Verify computed `background-color` exists (not `transparent` or inherited default)
  5. If `bg-background` class is not applied or has no effect, check generated CSS in `.next/static/css/` for `--color-background` usage
  6. **Alternative check**: In devtools, search Elements panel for `bg-background` class - it should be on `<body>` and have associated CSS rule

  **Commit**: YES
  - Message: `feat(theme): add CSS variables for light/dark mode`
  - Files: `app/global.css`

---

- [ ] 2. Create ThemeProvider client component

  **What to do**:
  - Create `app/_components/ThemeProvider.tsx`
  - Wrap `next-themes` ThemeProvider with "use client" directive
  - Configure: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`

  **Component code**:
  ```tsx
  "use client";
  
  import { ThemeProvider as NextThemesProvider } from "next-themes";
  import type { ComponentProps } from "react";
  
  export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
    return (
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
      >
        {children}
      </NextThemesProvider>
    );
  }
  ```

  **Must NOT do**:
  - Add additional props or configuration
  - Create multiple theme providers
  - Add state management beyond next-themes

  **Parallelizable**: NO (depends on task 1)

  **References**:
  - `app/_components/Header/index.tsx:1-5` - example of client component structure (`"use client"` directive, imports at top, export at bottom). Note: Header uses `FC` type with default export. ThemeProvider intentionally uses `ComponentProps` typing with **named export** (not default) as shown in the code snippet above - this allows proper props inference from `NextThemesProvider`. Import later as `import { ThemeProvider } from "./_components/ThemeProvider"`.

  **Acceptance Criteria**:
  - [ ] File exists at `app/_components/ThemeProvider.tsx`
  - [ ] Has `"use client"` directive at top
  - [ ] Exports `ThemeProvider` function component
  - [ ] Configured with `attribute="class"`, `defaultTheme="system"`, `enableSystem`
  - [ ] TypeScript compiles without errors

  **Commit**: YES
  - Message: `feat(theme): add ThemeProvider wrapper component`
  - Files: `app/_components/ThemeProvider.tsx`

---

- [ ] 3. Create ThemeToggle component

  **What to do**:
  - Create `app/_components/ThemeToggle.tsx`
  - Native button with sun/moon SVG icons
  - Use `useTheme()` hook from next-themes
  - Add mounted state check to prevent hydration mismatch
  - Toggle between light/dark (skip system in toggle)

  **Component code**:
  ```tsx
  "use client";
  
  import { useTheme } from "next-themes";
  import { useEffect, useState } from "react";
  
  export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) return <div className="ml-4 size-5" />;
  
    return (
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="ml-4 text-foreground hover:text-muted-foreground transition-colors"
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      >
        {resolvedTheme === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    );
  }
  ```

  **Must NOT do**:
  - Use ShadCN Button component
  - Add dropdown menu for theme selection
  - Add animations beyond simple color transition
  - Use emoji instead of SVG icons

  **Theme toggle UX behavior**:
  - `defaultTheme="system"`: On first visit, theme follows OS preference
  - Toggle skips "system" option - clicking only alternates between `"light"` and `"dark"`
  - localStorage key: `"theme"` (next-themes default)
  - localStorage values: `"light"` or `"dark"` (explicitly set), or absent (system preference)
  - When user is on system=dark and clicks toggle: explicitly sets `"light"` in localStorage
  - Clearing localStorage returns to system preference

  **Parallelizable**: NO (depends on task 1 for colors)

  **References**:
  - `app/_components/Header/index.tsx:1-5` - example of client component placement. Note: ThemeToggle uses **named export** (not default like Header) for consistency with ThemeProvider. Import later as `import { ThemeToggle } from "./_components/ThemeToggle"`.
  - next-themes docs: https://github.com/pacocoursey/next-themes#usetheme (useTheme hook, mounted pattern)

  **Acceptance Criteria**:
  - [ ] File exists at `app/_components/ThemeToggle.tsx`
  - [ ] Has `"use client"` directive
  - [ ] Uses `useTheme()` hook from next-themes
  - [ ] Has mounted state check (returns placeholder when !mounted)
  - [ ] Toggles between light/dark on click
  - [ ] Uses `text-foreground` (theme color)
  - [ ] Has `ml-4` class for spacing when placed in Header nav
  - [ ] Has accessible `aria-label`

  **Commit**: YES
  - Message: `feat(theme): add ThemeToggle component with sun/moon icons`
  - Files: `app/_components/ThemeToggle.tsx`

---

- [ ] 4. Update layout.tsx with ThemeProvider and FOUC prevention

  **What to do**:
  - Import ThemeProvider from `./_components/ThemeProvider`
  - Add `suppressHydrationWarning` to `<html>` tag
  - Add FOUC prevention script using `next/script` with `strategy="beforeInteractive"`
  - Wrap body content with ThemeProvider
  - Add `bg-background text-foreground` to body classes
  - Keep analytics Script in its current position (after `</body>`)

  **Target layout structure**:
  ```tsx
  import Script from "next/script";
  import { ThemeProvider } from "./_components/ThemeProvider";
  // ... existing imports

  export default function RootLayout({ children }: { children: ReactNode }) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background text-foreground mx-auto flex h-screen max-w-2xl flex-col">
          <Script
            id="theme-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const theme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  }
                })();
              `,
            }}
          />
          <ThemeProvider>
            <Header />
            <main className="m-2 flex-grow md:m-0">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
        {process.env.NODE_ENV === "production" && (
          <Script
            src="https://analytics.dimitristrechas.com/script.js"
            data-website-id="d0e7f80d-e948-4821-95ce-6fcc3868120c"
          />
        )}
      </html>
    );
  }
  ```

  **CRITICAL placement rule**:
  - Place `<Script id="theme-init".../>` as **first child of `<body>`**, before `<ThemeProvider>`
  - Next.js will auto-inject it into `<head>` regardless of JSX placement (per docs), but putting it first in `<body>` ensures correct logical order in code

  **CRITICAL structural constraint**:
  - ThemeProvider MUST be inside `<body>` only - wraps Header, main, Footer
  - FOUC script placement in JSX doesn't matter - Next.js handles injection (see below)
  - Analytics `<Script>` MUST remain as direct child of `<html>`, sibling of `<body>` (NOT inside ThemeProvider)
  - Do NOT "clean up" by moving Script inside body or wrapping it with ThemeProvider

  **Why this approach (not raw `<head>` script)**:
  - Next.js docs state: "scripts with `beforeInteractive` will always be injected inside the `head` of the HTML document **regardless of where they are placed** within the component"
  - This means our script in `<body>` JSX will be auto-moved to `<head>` by Next.js at build time
  - Raw `<head>` tags are not recommended per Next.js: "You should not manually add `<head>` tags to root layouts"
  - Requires `id` prop for inline scripts (Next.js tracking/optimization)

  **Next.js docs reference** (quote from Script component docs):
  > "`beforeInteractive` scripts must be placed inside the root layout (`app/layout.tsx`)... scripts with `beforeInteractive` will always be injected inside the `head` of the HTML document regardless of where they are placed within the component."

  **Why custom script despite next-themes having built-in flash prevention**:
  - next-themes injects its own script via ThemeProvider, but it runs AFTER React hydration begins
  - Our `beforeInteractive` script runs earlier (before Next.js modules load), adding `.dark` class before any paint
  - This double-defense approach ensures zero flash even on slow connections where hydration may delay
  - The scripts don't conflict: ours adds `.dark` class, next-themes reads/manages theme state afterward

  **FOUC verification protocol** (MUST run in production mode):
  1. `npm run build && npm start`
  2. Open http://localhost:3000 in browser
  3. **Objective check A**: View Page Source → verify `<script id="theme-init">` appears inside `<head>` section (Next.js auto-injection)
  4. Set dark mode via toggle, then hard refresh (Cmd+Shift+R)
  5. **Objective check B**: Immediately after refresh, open DevTools Elements panel → verify `<html class="dark">` attribute exists (NOT added after delay)
  6. **Subjective check**: Background should render dark from first visible frame. If noticeable white flash occurs, investigate script execution order.
  7. **Pass criteria**: Both objective checks pass. Subjective check has no obvious flash.

  **Must NOT do**:
  - Remove existing analytics Script
  - Change metadata
  - Move analytics Script from its structural position (direct child of `<html>`, after `</body>`)
  - Add CSS transitions to body
  - Use raw `<head>` element with `<script>` (not recommended for root layouts per Next.js docs)

  **Parallelizable**: NO (depends on task 2)

  **References**:
  - `app/layout.tsx` - current layout file
  - Search for `<html lang="en">` - add `suppressHydrationWarning` attribute here
  - Search for `<body className=` - prepend `bg-background text-foreground` to existing classes
  - Search for `{process.env.NODE_ENV === "production" && (` - this is the analytics Script block, keep it as sibling of `<body>` inside `<html>` exactly as currently structured
  - next-themes docs: https://github.com/pacocoursey/next-themes#with-app (suppressHydrationWarning requirement)
  - Next.js Script docs: https://nextjs.org/docs/app/api-reference/components/script#beforeinteractive (strategy placement)

  **Acceptance Criteria**:
  - [ ] `<html>` has `suppressHydrationWarning` attribute
  - [ ] `<Script id="theme-init" strategy="beforeInteractive">` exists as first child of `<body>` (before `<ThemeProvider>`)
  - [ ] Script has `id` prop (required for inline scripts per Next.js)
  - [ ] `<body>` content wrapped with `<ThemeProvider>`
  - [ ] `<body>` has `bg-background text-foreground` classes (prepended to existing)
  - [ ] Analytics `<Script>` remains direct child of `<html>`, sibling of `<body>` (NOT inside ThemeProvider or body)
  - [ ] `npm run build` succeeds
  - [ ] **View Source check**: `<script id="theme-init">` appears inside `<head>` section (Next.js auto-injection)
  - [ ] **Primary verification**: FOUC protocol passes (see above) - no white flash visible on prod-mode hard refresh

  **Commit**: YES
  - Message: `feat(theme): integrate ThemeProvider with FOUC prevention`
  - Files: `app/layout.tsx`

---

- [ ] 5. Add ThemeToggle to Header

  **What to do**:
  - Import ThemeToggle component
  - Add to nav, after contact link (right side)
  - Update text colors to use `text-foreground` instead of hardcoded grays

  **Must NOT do**:
  - Change nav structure/layout
  - Modify Link behavior
  - Add dropdown or complex menu
  - Change underline styling for active route

  **Parallelizable**: NO (depends on tasks 3, 4)

  **References**:
  - `app/_components/Header/index.tsx` - current Header implementation
  - Search for `text-slate-600` - site title color (change to `text-muted-foreground`)
  - Search for `text-gray-800` - nav link colors (change all to `text-foreground`)
  - Search for `ml-auto` in nav div - this is where toggle will be added (after last Link)

  **Exact changes** (search/replace based, not line numbers):
  - Find `text-slate-600` on site title Link → replace with `text-muted-foreground`
  - Find `text-gray-800` on nav Links (3 occurrences) → replace all with `text-foreground`
  - After the Contact `</Link>` inside the nav div, add `<ThemeToggle />`
  - Add import at top: `import { ThemeToggle } from "../ThemeToggle";`
    - Note: Header is at `app/_components/Header/index.tsx`, ThemeToggle will be at `app/_components/ThemeToggle.tsx`, so relative path is `../ThemeToggle`

  **Acceptance Criteria**:
  - [ ] ThemeToggle imported and rendered in nav
  - [ ] Toggle appears after "contact" link
  - [ ] `text-slate-600` → `text-muted-foreground` on site title
  - [ ] `text-gray-800` → `text-foreground` on nav links
  - [ ] Active route underline still works
  - [ ] Visually matches original light mode appearance

  **Commit**: YES
  - Message: `feat(header): add theme toggle and use semantic colors`
  - Files: `app/_components/Header/index.tsx`

---

- [ ] 6. Update remaining components to use theme colors

  **What to do**:
  - Footer: Update any hardcoded colors to semantic theme colors
  - PostCard: Update `text-gray-800` to `text-foreground`, keep tag colors fixed
  - Fix PostCard `border-b-1` to valid Tailwind class `border-b border-border`
  - Blog post markdown: Add `dark:prose-invert` class unconditionally

  **Must NOT do**:
  - Change tag background colors (keep inline `style={{ backgroundColor: tag.color }}`)
  - Modify component logic or structure
  - Add dark mode variants to tags
  - Change font sizes or spacing

  **Parallelizable**: YES (can run alongside task 5 after task 1 complete)

  **References**:
  - `app/_components/Footer/index.tsx` - current Footer (no hardcoded colors, inherits from body)
  - `app/_components/PostCard/index.tsx` - search for `border-b-1` (invalid class to fix), `text-gray-800` (title color)
  - `app/blog/[slug]/page.tsx` - search for `className="prose max-w-none"` (article element)

  **Exact changes for PostCard** (search/replace based):
  - Find `border-b-1` → replace with `border-b border-border`
  - Find `text-gray-800` on title h2 → replace with `text-foreground`
  - Find the date `<div>` after the title (contains `new Date`) → add `className="text-muted-foreground"` (or append to existing className)

  **Exact changes for Footer**:
  - **Decision**: Footer inherits `text-foreground` from `<body>` after Task 4. Adding explicit class is redundant.
  - **Action**: NO CHANGE to Footer. It will inherit correctly from body's `text-foreground` class.

  **Exact changes for blog post page**:
  - Find `className="prose max-w-none"` on article element → replace with `className="prose dark:prose-invert max-w-none"`

  **Acceptance Criteria**:
  - [ ] PostCard title uses `text-foreground` (search for class in file)
  - [ ] PostCard date uses `text-muted-foreground`
  - [ ] PostCard border changed from `border-b-1` to `border-b border-border`
  - [ ] Tag colors unchanged (still inline style with `backgroundColor`)
  - [ ] Blog post article has `dark:prose-invert` class
  - [ ] Footer unchanged (inherits from body)
  - [ ] `npm run build` succeeds
  - [ ] `npm run lint` passes

  **Commit**: YES
  - Message: `feat(components): update PostCard and blog page to use theme colors`
  - Files: `app/_components/PostCard/index.tsx`, `app/blog/[slug]/page.tsx`

---

- [ ] 7. Manual QA verification

  **What to do**:
  - Start dev server: `npm run dev`
  - Test all pages in both light and dark mode
  - Verify theme persistence
  - Run build and lint

  **Must NOT do**:
  - Skip any page
  - Skip persistence test
  - Ignore console errors

  **Parallelizable**: NO (final task)

  **References**:
  - All modified files from tasks 0-6

  **Acceptance Criteria**:

  **Build Verification:**
  - [ ] `npm run build` → exits 0, no errors
  - [ ] `npm run lint` → ESLint passes
  - [ ] `npm run biome:check` → Biome passes

  **Manual Verification (using dev server):**
  - [ ] Navigate to `http://localhost:3000` (home)
    - [ ] Light mode: white background (`hsl(0 0% 100%)`), dark text (`hsl(0 0% 3.9%)`)
    - [ ] Toggle: click toggle → dark background (`hsl(0 0% 3.9%)`), light text (`hsl(0 0% 98%)`)
    - [ ] **Zero FOUC test**: Set dark mode → hard refresh (Cmd+Shift+R) → background is dark from FIRST paint (no white flash visible, not even for one frame)
    - [ ] No hydration warnings in browser console
  - [ ] Navigate to `/blog`
    - [ ] Post cards readable in both modes
    - [ ] Tag colors visible and unchanged
    - [ ] Border between posts visible in both modes
  - [ ] Navigate to `/blog/[any-post]`
    - [ ] Markdown prose readable in both modes (with `dark:prose-invert` applied)
    - [ ] Code blocks: Accept current styling as-is (code block theming is out of scope; if unreadable, note for future work but do not fix)
  - [ ] Navigate to `/about` and `/contact`
    - [ ] Content readable in both modes
  - [ ] Theme persistence:
    - [ ] Set dark mode → refresh page → still dark
    - [ ] Set light mode → close tab, reopen → still light
    - [ ] Clear localStorage → refresh → follows system preference

  **Commit**: YES (after Tasks 0-6 are committed on the same branch and QA passes)
  - Message: `chore: bump version to 2.3.0 for dark mode feature`
  - Files: `package.json` (version field only, no dependency changes)
  - This is the final commit on the feature branch after verifying all functionality

  **Version policy**: Current version is 2.2.0. Bumping to 2.3.0 per SemVer (minor version for new feature - dark mode). This commit happens AFTER manual QA passes (build/lint verified). Edit only the `"version"` field in `package.json`; do not change dependencies.

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 0 | `chore: add next-themes for dark mode` | package.json, package-lock.json | npm run build |
| 1 | `feat(theme): add CSS variables for light/dark mode` | app/global.css | npm run build |
| 2 | `feat(theme): add ThemeProvider wrapper component` | app/_components/ThemeProvider.tsx | TypeScript check |
| 3 | `feat(theme): add ThemeToggle component with sun/moon icons` | app/_components/ThemeToggle.tsx | TypeScript check |
| 4 | `feat(theme): integrate ThemeProvider with FOUC prevention` | app/layout.tsx | npm run build |
| 5 | `feat(header): add theme toggle and use semantic colors` | app/_components/Header/index.tsx | npm run build |
| 6 | `feat(components): update PostCard and blog page to use theme colors` | PostCard, blog/[slug]/page.tsx | npm run lint |
| 7 | `chore: bump version to 2.3.0 for dark mode feature` | package.json | Full QA |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: exit 0, no errors
npm run lint   # Expected: ESLint passes (no errors)
npm run biome:check  # Expected: Biome passes (no errors)
npm run dev    # Expected: server starts, test manually
```

### Final Checklist
- [ ] All "Must Have" present (ShadCN CSS pattern, zero flash, native toggle, system preference)
- [ ] All "Must NOT Have" absent (no @theme inline, no ShadCN components, no OKLCH, no tag changes)
- [ ] Version bumped to 2.3.0
- [ ] Both Linear issues (PERS-17, PERS-18) addressed
