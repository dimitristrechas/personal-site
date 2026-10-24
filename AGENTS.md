# AGENTS.md

## Key Architectural Decisions

- Blog content from Ghost CMS is **pre-rendered HTML**, not Markdown. `lib/html.ts` processes it with node-html-parser: external links get `target="_blank"` + `noopener`, and links Ghost absolutized to its own origin with a `/blog/` path are rewritten back to site-relative (Ghost rewrites relative `/blog/{slug}` hrefs to absolute on save — see [Ghost content gotcha](#ghost-content-gotcha) below).
- Ghost API responses mapped to domain types via adapters in `types/` — **no runtime validation** (intentional; do not add Zod or similar).
- Article series are configured in Ghost with one **hub post** per series. Give that post a **public** tag whose slug starts with `series-` (for example, slug `series-react-patterns`). The hub post links to the other articles in the series via `/blog/{slug}` links in its HTML; the homepage and `/series/[slug]` page render that hub post as the aggregator. Only the hub post carries the `series-*` tag (members stay untagged); series tags are hidden from regular post tag chips in `app/_components/PostCard/index.tsx`, hub posts are excluded from Latest Posts, and the hub must be the earliest-published post carrying the tag.
- Ghost CMS itself is Git-backed in this repo under `ghost/`. Dokploy resource `ghost` (`dimitristrechas` project) deploys `./ghost/docker-compose.yml` from `main` with `watchPaths: ["ghost/**"]`. Same `composeId`/`appName` as before, so volumes, R2 backups, and `ghost.dimitristrechas.com` are preserved. Pinned images: `ghost:6.72`, `mysql:8.0` (MySQL 8.0 is EoL — upgrading to 8.4 LTS is a separate, backup-backed job; do not bundle it with other changes). Staff device verification is currently **disabled in prod** via `security__staffDeviceVerification` in the compose file (Ghost checks `config !== true`) because there is no working SMTP — transactional mail was never wired (Direct is blocked from the VPS). Proper fix: configure SMTP (Mailgun/SES/etc.), then remove that line to re-enable verification.
- `.env` is **always local** (points at local Ghost). Prod values live in the Dokploy UI env and GitHub Actions secrets, with a gitignored backup in `.env.prod.local`. Never point `.env` at production, never commit it.
- `pnpm dev` serves the site on `:3001`. `next.config.ts` allows `http://localhost/**` images via `next/image` in development only.

## Local development (agents: follow this exactly)

- Site: `pnpm dev` → http://localhost:3001 (reads `.env`; no inline env overrides needed).
- Ghost: **always include the override file** — never run the base file alone locally (it has no published ports and carries the prod URL):
  `docker compose -f ghost/docker-compose.yml -f ghost/docker-compose.local.yml up -d` → http://localhost:2368, admin at http://localhost:2368/ghost
  `... down` stops; `... down -v` wipes local content. Local volumes (`ghost_ghost`, `ghost_db`) never touch prod (prod volumes live on the VPS).
- `ghost/docker-compose.local.yml` is local-only: loopback-bound port, `url: http://localhost:2368`, and a read-only mount of `ghost/config.local.json` (disables staff new-device email verification and mirrors the image's `server.host: "::"` bind; without the bind the host port goes dead). Dokploy only loads `docker-compose.yml`, so this file can never affect prod. Do not add the mount or dev settings to the base file.
- Seeded local admin: `local-dev@example.com` / `g_uaZR52mMfbLQGg`. The local Content API key lives in `.env` (`GHOST_CONTENT_API_KEY`) and under Settings → Integrations in the admin panel. Seed/manage content via the Admin API (`/ghost/api/admin/...` with a session cookie); tags endpoint accepts one tag per request; create posts with `?source=html`.
- First run on a fresh machine (empty volumes): `ghost/.env` holds the local DB password (`MYSQL_ROOT_PASSWORD`, gitignored — create it from `ghost/.env.example` values if missing, otherwise compose fails fast); boot the stack, complete owner onboarding at http://localhost:2368/ghost, then create a custom integration (Settings → Integrations) and put its Content API key in `.env` as `GHOST_CONTENT_API_KEY`. The seeded credentials above exist only where the volume was seeded with them.
- `ghost/` is excluded from the web image via `.dockerignore`.

## Ghost content gotcha

Ghost absolutizes relative links to its own origin when saving. Author series-hub links as `/blog/{slug}` (the site rewrites Ghost-origin `/blog/` links to relative at render), and always verify rendered hrefs on `/series/{slug}` — links pointing at the Ghost origin 404 on Ghost's own theme.

## Instructions

**CRITICAL: Never commit code unless explicitly instructed to do so in the prompt.**

- Test changes before considering them complete. There are no unit or integration tests in this repo yet, so verify with `curl` against the dev server and local Ghost, and use agent-browser, Chrome DevTools MCP, or Playwright MCP to visually verify changes in the UI.
- Dokploy writes (`compose-update`, deploys) change production and need explicit user confirmation; switching a resource's source does not redeploy by itself, but the next matching push auto-deploys.

## Reference

- Cross-tool AI and MCP: [.agent-docs/ai-tooling.md](.agent-docs/ai-tooling.md)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
