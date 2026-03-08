# AGENTS.md

## Key Architectural Decisions

- Blog content from Ghost CMS is **pre-rendered HTML**, not markdown. `lib/html.ts` processes it with node-html-parser.
- Ghost API responses mapped to domain types via adapters in `types/` — **no runtime validation** (intentional; do not add Zod or similar).

## Instructions

**CRITICAL: Never commit code unless explicitly instructed to do so in the prompt.**

- Test changes before considering them complete. There are no unit or integration tests in this repo yet, so use agent-browser, Chrome DevTools MCP, or Playwright MCP to visually verify changes in the UI.
