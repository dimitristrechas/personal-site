#!/usr/bin/env node
// Cursor beforeShellExecution / beforeMCPExecution hook. Asks for approval on the
// shell commands and MCP servers flagged in .agent-docs/agent-config.json, the
// same set Claude Code, Codex and OpenCode gate natively.

import { readFileSync } from "node:fs";

const mode = process.argv[2];
const allow = { continue: true, permission: "allow" };

function respond(result) {
  process.stdout.write(JSON.stringify(result));
  process.exit(0);
}

try {
  const input = JSON.parse(readFileSync(0, "utf8") || "{}");
  const config = JSON.parse(readFileSync(new URL("../../.agent-docs/agent-config.json", import.meta.url), "utf8"));

  if (mode === "shell") {
    const command = String(input.command ?? "");
    const segments = command.split(/&&|\|\||[;|\n]/).map((segment) => segment.trim().split(/\s+/));
    const gated = config.shellCommandsRequiringApproval.find((pattern) =>
      segments.some((words) => pattern.every((word, index) => words[index] === word)),
    );
    if (gated) {
      respond({
        continue: true,
        permission: "ask",
        user_message: `\`${gated.join(" ")}\` requires your approval (AGENTS.md hard rules).`,
        agent_message: `\`${gated.join(" ")}\` needs explicit user approval in this repo.`,
      });
    }
  }

  if (mode === "mcp") {
    const serverName = input.mcp_server_name;
    const gated = Object.entries(config.mcpServers).find(
      ([name, server]) => server.requireApproval && (serverName === undefined || serverName === name),
    );
    if (gated) {
      respond({
        continue: true,
        permission: "ask",
        user_message: `MCP server \`${gated[0]}\` can change production and requires your approval.`,
        agent_message: `Tools from MCP server \`${gated[0]}\` need explicit user approval in this repo.`,
      });
    }
  }

  respond(allow);
} catch (error) {
  respond({
    continue: true,
    permission: "ask",
    user_message: `approval-gate hook failed (${error instanceof Error ? error.message : error}); asking to be safe.`,
  });
}
