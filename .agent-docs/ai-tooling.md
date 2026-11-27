# AI tooling: Claude Code, Codex, OpenCode

All three tools must get the same instructions, subagents, skills, MCP servers, and approval gates. The files are maintained by hand, so every change must touch each tool's file in the same commit. Cursor is not supported; do not add `.cursor/` config.

## Sources of truth

| What | Canonical file | Mirrors to update by hand |
| --- | --- | --- |
| Instructions | `AGENTS.md` | None. Codex and OpenCode read it natively; `CLAUDE.md` contains only `@AGENTS.md` (a `CLAUDE.md` disables Claude's native `AGENTS.md` loading, so keep the import). |
| Subagents | `.claude/agents/<name>.md` | `.codex/agents/<name>.toml` (`name`, `description`, `developer_instructions` = the markdown body); `.opencode/agents/<name>.md` symlink → `../../.claude/agents/<name>.md` |
| Skills | `.claude/skills/<name>/SKILL.md` | `.agents/skills/<name>` symlink → `../../.claude/skills/<name>` (Codex) |
| MCP servers | `.mcp.json` | `.codex/config.toml`, `opencode.json` (`mcp.servers`) |
| Approval gates | `.claude/settings.json` (`permissions.ask`) | `.codex/rules/project.rules`, `.codex/config.toml` (`default_tools_approval_mode`), `opencode.json` (`permissions`) |

Subagent frontmatter: `name` (= file name), `description`, `mode: subagent`. Don't set `model` (every tool inherits the session model) or other tool-specific fields.

## What each tool loads

| | Claude Code | Codex | OpenCode |
| --- | --- | --- | --- |
| Instructions | `CLAUDE.md` → `@AGENTS.md` | `AGENTS.md` | `AGENTS.md` |
| Subagents | `.claude/agents/` | `.codex/agents/*.toml` | `.opencode/agents/` |
| Skills | `.claude/skills/` | `.agents/skills/` | `.claude/skills/` + `.agents/skills/` |
| MCP | `.mcp.json` | `.codex/config.toml` | `opencode.json` `mcp.servers` |
| Shell approval | `permissions.ask`: `Bash(git commit *)` | `prefix_rule(pattern = ["git", "commit"], decision = "prompt")` | `{ "action": "shell", "resource": "git commit *", "effect": "ask" }` |
| MCP approval | `permissions.ask`: `mcp__<server>` | `default_tools_approval_mode = "prompt"` on the server | `{ "action": "<server>_*", "resource": "*", "effect": "ask" }`; replace non-alphanumeric characters in the server name with `?` (e.g. `cloudflare?api_*`) |

Currently gated: `git commit`, `git push`, `git reset`, `git reflog`, and the `dokploy` and `cloudflare-api` MCP servers.

## Syntax per file

| | Remote server | Stdio server | Env placeholder |
| --- | --- | --- | --- |
| `.mcp.json` | `"type": "http"`, `url`, `headers.Authorization: "Bearer ${VAR}"` | `command`, `args`, `env` | `${VAR}` |
| `.codex/config.toml` | `url`, `bearer_token_env_var = "VAR"` | `command`, `args`, `env_vars = ["VAR"]`, static values in `[mcp_servers.<name>.env]` | variable names only |
| `opencode.json` | `"type": "remote"`, `url`, `"oauth": false`, `headers` | `"type": "local"`, `command` as one array, `environment` | `{env:VAR}` |

Required env vars: `GITHUB_MCP_TOKEN`, `LINEAR_MCP_TOKEN`, `CONTEXT7_API_KEY`, `CLOUDFLARE_API_TOKEN`, `DOKPLOY_URL`, `DOKPLOY_API_KEY`. Keep the README "AI coding tools" list in sync.

## Trust (per machine, not in the repo)

- **Claude Code:** approve the project MCP servers on first run.
- **Codex:** trust the project on first run. Until then the whole `.codex/` layer (MCP, rules, agents) is skipped.
- **OpenCode:** no trust step.

## Verify after changes

- Same server names, URLs and env var names in `.mcp.json`, `.codex/config.toml` and `opencode.json`.
- Same gated commands and servers in `.claude/settings.json`, `.codex/rules/project.rules`, `.codex/config.toml` and `opencode.json`.
- `.codex/agents/<name>.toml` `description` and `developer_instructions` match `.claude/agents/<name>.md`; symlinks resolve.
- `claude mcp list` shows the project servers.
- `codex mcp list` (trusted) shows the project servers; `codex execpolicy check --rules .codex/rules/project.rules git commit -m x` returns `prompt`.
- `opencode debug agents` lists `frontend-architect` as `subagent` with the project permissions; `opencode debug config` shows the project `mcp.servers`.

## Policy

- Do not add GitHub Copilot-specific MCP endpoints or agent files.
- Do not add tool-specific rule files that restate `AGENTS.md`; put shared guidance in `AGENTS.md`.
