# AGENTS.md

Instructions for AI coding agents working in this repo. Human-facing docs live in `README.md`.

## Hard rules

- **Never commit code unless explicitly instructed to do so in the prompt.**
- **Never write credentials (local or prod) into tracked files.** Secrets belong in the gitignored `.env` / `ghost/.env`; docs reference variable names only.
- `.env` is **always local** (points at local Ghost). Never point it at production and never commit it. Prod values live in the Dokploy UI env and GitHub Actions secrets (gitignored backup: `.env.prod.local`).
- Dokploy writes (`compose-update`, deploys) change production and need explicit user confirmation. Switching a resource's source does not redeploy by itself, but the next matching push to `main` auto-deploys.
- Do not add Zod or any other runtime validation.
- Do not bundle a MySQL major upgrade with other changes. `mysql:8.4` is frozen in `renovate.json` (26.x broke prod, PR #127); upgrading needs a separate, backup-backed migration.

## Architecture

- **Ghost content is pre-rendered HTML, not Markdown.** `lib/html.ts` processes it with node-html-parser: external links (host not equal to, or a subdomain of, `NEXT_PUBLIC_SITE_URL`'s host) get `target="_blank"` + `noopener`, and Ghost-origin links to site routes are rewritten back to site-relative (see [Ghost content gotcha](#ghost-content-gotcha)). `lib/timeline.ts` turns the About page into a career timeline.
- **Adapters, no validation.** Ghost API responses map to domain types via adapters in `types/`.
- **Data access:** `lib/posts.ts` (posts), `lib/pages.ts` (Ghost pages), `lib/series.ts` (series + blog feed). Wrap every fetcher in React `cache` so `generateMetadata` and the page share requests. Routes use ISR (`revalidate`); there is no client-side fetching.
- **Page titles:** the root layout sets `title.template` (`%s | Dimitris Trechas`). Pages return bare titles; a Ghost `meta_title` is used as `{ absolute }`.
- **Components:** `app/_components/<Name>/index.tsx` with a default export.
- **Series are Ghost tags, not link lists.**
  - One **internal** tag per series (name starts with `#`, e.g. `#React Patterns`; the slug must be set manually to `hash-series-react-patterns`, because Ghost's default `hash-react-patterns` is not recognised). Tag metadata (`name`, `description`, `feature_image`) is the series definition; `include=count.posts` gives the count. Internal tags get no Ghost archive or sitemap entry.
  - Every member post plus one **hub/intro post** carries the tag. Hub = earliest-published tagged post; `/blog/{hub}` permanently redirects to `/series/{slug}`, members stay readable.
  - `lib/series.ts` resolves the tag via the Content API, renders the hub HTML as intro, and lists members (`published_at ASC`, hub excluded). Never parse hub links for membership.
  - Series tags are hidden from tag chips (`app/_components/PostCard`). Only hub posts are excluded from Latest Posts / blog feeds.
  - Legacy public `series-*` tags still resolve (internal slug tried first). New series must use `hash-series-*`.
- **Ghost CMS is Git-backed under `ghost/`.** Dokploy resource `ghost` (`dimitristrechas` project) deploys `./ghost/docker-compose.yml` from `main` with `watchPaths: ["ghost/**"]`. Do not change its `composeId`/`appName`: volumes, R2 backups, and `ghost.dimitristrechas.com` depend on them. `ghost/` is excluded from the web image via `.dockerignore`.
- **Prod staff device verification is disabled** via `security__staffDeviceVerification` in `ghost/docker-compose.yml` (Ghost checks `config !== true`), because there is no working SMTP (Direct is blocked from the VPS). Proper fix: configure SMTP (Mailgun/SES/etc.), then remove that line.
- `next.config.ts` allows `http://localhost/**` images via `next/image` in development only.

## Local development

Follow this exactly.

- Site: `pnpm dev` → http://localhost:3001 (reads `.env`; no inline env overrides needed).
- Ghost: **always include the override file**. Never run the base file alone locally (it has no published ports and carries the prod URL):
  `docker compose -f ghost/docker-compose.yml -f ghost/docker-compose.local.yml up -d` → http://localhost:2369, admin at http://localhost:2369/ghost.
  `... down` stops; `... down -v` wipes local content. Local volumes (`ghost_ghost`, `ghost_db`) never touch prod.
- `ghost/docker-compose.local.yml` is local-only: compose project `personal-ghost`, loopback port `127.0.0.1:2369:2368`, `url: http://localhost:2369`, and a read-only mount of `ghost/config.local.json` (disables staff device verification and keeps the image's `server.host: "::"` bind; without the bind the host port goes dead). The distinct project/port avoid colliding with the Ghost monorepo dev stack (`ghost-dev`, port 2368); volume names are pinned so existing local data survives the project rename. Dokploy only loads `docker-compose.yml`. Do not add the mount or dev settings to the base file.
- Credentials: admin login in `.env` (`GHOST_ADMIN_EMAIL`, `GHOST_ADMIN_PASSWORD`); Content API key in `.env` (`GHOST_CONTENT_API_KEY`, also under Settings → Integrations).
- Seeding content: use the Admin API (`/ghost/api/admin/...` with a session cookie from `POST /ghost/api/admin/session/`). The tags endpoint accepts one tag per request; create posts with `?source=html`.
- Fresh machine (empty volumes): ensure `ghost/.env` exists with `MYSQL_ROOT_PASSWORD` (copy `ghost/.env.example`; compose fails fast without it), boot the stack, and ask the user to complete owner onboarding and create a custom integration. The resulting values go into `.env` as above.

## Ghost content gotcha

Ghost absolutizes relative links to its own origin when saving. Author series-hub links as `/blog/{slug}` (the site rewrites Ghost-origin site links to relative at render), and always verify rendered hrefs on `/series/{slug}`: links pointing at the Ghost origin 404 on Ghost's own theme.

## Verification

There are no unit or integration tests yet. Before considering a change complete:

- Run `pnpm lint` and `pnpm exec tsc --noEmit`.
- `curl` the affected routes against `pnpm dev` and local Ghost.
- Check UI changes visually with agent-browser, Chrome DevTools MCP, or Playwright MCP.

## AI tool config

- Claude Code, Codex, and OpenCode share one setup (Cursor is not supported). Edit only the canonical sources (`AGENTS.md`, `.claude/agents/`, `.claude/skills/`, `.agent-docs/agent-config.json`), then run `pnpm agents:sync`. Never hand-edit generated files (`.mcp.json`, `.codex/**`, `.claude/settings.json`, `opencode.json`, agent/skill symlinks). Details: [.agent-docs/ai-tooling.md](.agent-docs/ai-tooling.md).
- Approval gates (`git commit`/`push`/`reset`/`reflog`, `dokploy` and `cloudflare-api` MCP tools) are enforced by each tool's config. Do not try to bypass them.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
