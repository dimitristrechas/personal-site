# personal-site

The code behind my personal site and blog, [dimitristrechas.com](https://www.dimitristrechas.com).

It's a Next.js (App Router) site. All content (posts, the About and Contact pages, and article series) is written in a self-hosted [Ghost](https://ghost.org) instance and pulled in through the Ghost Content API. Pages are rendered on the server and refreshed periodically, so edits in Ghost show up on the site within minutes without a redeploy.

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Ghost 6 + MySQL 8.4 (Docker Compose, in [`ghost/`](ghost/))
- Biome + ESLint, Lefthook git hooks, Renovate for dependency updates
- Deployed with Dokploy: GitHub Actions builds the site image to GHCR and triggers a deploy; the Ghost stack is deployed from `ghost/docker-compose.yml`

## Getting started

### Prerequisites

- Node.js 26 (see [`.nvmrc`](.nvmrc))
- pnpm, the version pinned in `package.json` → `packageManager` (`npm install -g pnpm@<version>`)
- Docker (for the local Ghost instance)

### Setup

1. Clone and install:

   ```sh
   git clone https://github.com/dimitristrechas/personal-site.git
   cd personal-site
   pnpm install
   ```

2. Create the env files:

   ```sh
   cp .env.example .env
   cp ghost/.env.example ghost/.env
   ```

3. Start the local Ghost instance. Always pass both compose files; the second one adds the local port and settings:

   ```sh
   docker compose -f ghost/docker-compose.yml -f ghost/docker-compose.local.yml up -d
   ```

4. Open http://localhost:2369/ghost and create the owner account. Optionally save the login in `.env` as `GHOST_ADMIN_EMAIL` / `GHOST_ADMIN_PASSWORD`.

5. In Ghost, go to **Settings → Integrations → Add custom integration** and copy its Content API key into `.env` as `GHOST_CONTENT_API_KEY`.

6. Start the site:

   ```sh
   pnpm dev
   ```

   The site runs on http://localhost:3001.

To stop Ghost, run the same compose command with `down`. `down -v` also deletes all local content. The local stack never touches production data.

### Scripts

| Command            | What it does                  |
| ------------------ | ----------------------------- |
| `pnpm dev`         | Dev server on port 3001       |
| `pnpm build`       | Production build (standalone) |
| `pnpm lint`        | Biome + ESLint                |
| `pnpm lint:fix`    | Biome + ESLint with auto-fix  |

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/). A git hook and CI both check this.

## Writing content

- **Posts and pages** are written in Ghost. The About and Contact pages are Ghost pages with the slugs `about` and `contact`.
- **Article series** are Ghost tags:
  1. Create an internal tag whose name starts with `#`, e.g. `#React Patterns`, and **set its slug by hand** to `hash-series-<name>`, e.g. `hash-series-react-patterns` (Ghost's default slug, `hash-react-patterns`, isn't recognised). The part after `hash-series-` becomes the URL: `/series/react-patterns`. The tag's description and feature image become the series description and cover.
  2. Write an intro post and tag it. The earliest-published tagged post is the series intro and is shown at `/series/<name>`.
  3. Tag every article in the series with the same tag. They're listed on the series page in publish order.
- **Links between posts**: write them as `/blog/<slug>`. Ghost turns relative links into absolute ones when saving, and the site rewrites them back.

## AI coding tools

The repo includes shared config for Claude Code, Codex and OpenCode (agents, skills, MCP servers). To use the MCP servers, export these in your shell profile:

```sh
export GITHUB_MCP_TOKEN=<token>
export LINEAR_MCP_TOKEN=<token>
export CONTEXT7_API_KEY=<token>
export CLOUDFLARE_API_TOKEN=<token>
export DOKPLOY_URL=<dokploy-base-url>   # base URL only, no /api
export DOKPLOY_API_KEY=<token>
```

Exa and Cloudflare Docs need no auth.

All three tools share the same instructions (`AGENTS.md`), subagents, skills, MCP servers, and approval prompts for commits, pushes and production-changing MCP tools. Some of that only activates once you trust the repo in each tool:

- **Claude Code:** approve the project MCP servers when prompted.
- **Codex:** trust the project when prompted; otherwise `.codex/` is ignored.
- **OpenCode:** nothing to do.

To change MCP servers, agents or skills, ask a coding agent to update all three tools' config together; the mapping is in [`.agent-docs/ai-tooling.md`](.agent-docs/ai-tooling.md).

## License

[MIT](LICENSE.txt)
