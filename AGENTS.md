# AGENTS.md

This file provides agent-specific guidance when working with code in this repository.

## Project Overview

Next.js 15 personal site/blog. TypeScript, React 19, Tailwind CSS 4. Fetches blog posts from external CMS (Strapi) via API_ENDPOINT env var. Markdown rendering with gray-matter + marked.

## Commands

- `npm run dev` - dev server with Turbopack
- `npm run build` - production build
- `npm start` - run production build
- `npm run lint` - Biome check + ESLint (Next.js rules)
- `npm run lint:fix` - auto-fix all issues
- `npm run format` - format with Biome

## Setup

1. Copy `.env.example` to `.env`
2. Set `API_ENDPOINT` to Strapi CMS URL (default: `http://localhost:1337/api`)
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

All blog data from external Strapi API:
- Server components fetch via `API_ENDPOINT` env var
- Posts returned as `Post[]` (see `globals.d.ts` for types)
- Blog posts are markdown in `content` field, parsed with gray-matter, rendered with marked
- Client search filters by normalized title (see `utils/helpers.ts`)

### Components

Reusable components in `app/_components/`:
- `Header`, `Footer` - layout
- `PostCard` - blog post preview card

### Styling

Tailwind CSS 4. Global styles in `app/globals.css`. Only use Baseline CSS features.

### Types

Global types in `globals.d.ts`: `Post`, `Tag`, `PageData`, `ContactPage`, `AboutPage`.

## Requirements

- Node >= 22.0.0
- Biome for linting + formatting
- ESLint for Next.js-specific rules (next/core-web-vitals, next/typescript)
