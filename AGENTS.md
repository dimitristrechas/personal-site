# AGENTS.md

This file provides agent-specific guidance when working with code in this repository.

## Project Overview

Next.js 16 personal site/blog. TypeScript, React 19, Tailwind CSS 4. Fetches blog posts from Ghost CMS via official Content API SDK. Content is pre-rendered HTML from Ghost, processed for external links.

## Commands

- `npm run dev` - dev server with Turbopack
- `npm run build` - production build
- `npm start` - run production build
- `npm run lint` - Biome check + ESLint (Next.js rules)
- `npm run lint:fix` - auto-fix all issues
- `npm run format` - format with Biome

## Setup

1. Copy `.env.example` to `.env`
2. Set `GHOST_URL` to Ghost CMS URL and `GHOST_CONTENT_API_KEY` to your Content API key
3. `npm install && npm run dev`

## Architecture

### App Structure

Next.js App Router. Pages in `app/`:
- `app/page.tsx` - home (fetches last 5 posts)
- `app/blog/page.tsx` - all posts list (server component)
- `app/blog/ClientComponent.tsx` - client-side search/filter
- `app/blog/[slug]/page.tsx` - individual post (markdown rendered)
- `app/about/page.tsx`, `app/contact/page.tsx` - static pages

### Data Flow

All blog data from Ghost CMS via official SDK:
- Server components use `ghostClient` from `lib/ghost.ts`
- Ghost API responses mapped via type adapters (no runtime validation)
- Ghost types (`GhostPost`, `GhostPage`) mapped to domain types (`Post`, `Page`) via adapters in `types/`
- HTML content processed with `processGhostHtml()` in `lib/markdown.ts` using node-html-parser
- External links enhanced with target="_blank", rel="noopener noreferrer", visual indicator
- Client search filters by normalized title (see `app/blog/ClientComponent.tsx`)

### Components

Reusable components in `app/_components/`:
- `Header`, `Footer` - layout
- `PostCard` - blog post preview card

### Styling

Tailwind CSS 4. Global styles in `app/global.css`. Only use Baseline CSS features.

### Types

Domain types in `types/`:
- `types/post.ts` - `Post`, `Tag`, `GhostPost`, `GhostTag` + mappers
- `types/page.ts` - `Page`, `GhostPage` + mappers

## Requirements

- Node >= 24.0.0
- Biome for linting + formatting
- ESLint for Next.js-specific rules (next/core-web-vitals, next/typescript)

## Git Hooks

Pre-commit auto-fixes and stages:
- Biome: lint/format
- ESLint: Next.js violations

Commit-msg enforces Conventional Commits.

## General Instructions

**CRITICAL: Never commit code unless explicitly instructed to do so in the prompt.**

- Follow user's specific instructions exactly
- Maintain existing code style and patterns
- Test changes before considering them complete
