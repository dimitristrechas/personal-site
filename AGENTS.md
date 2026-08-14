# AGENTS.md

## Key Architectural Decisions

- Blog content from Ghost CMS is **pre-rendered HTML**, not Markdown. `lib/html.ts` processes it with node-html-parser.
- Ghost API responses mapped to domain types via adapters in `types/` — **no runtime validation** (intentional; do not add Zod or similar).
- Article series are configured in Ghost with one **hub post** per series. Give that post a public tag whose slug starts with `series-` (for example, slug `series-react-patterns`). The hub post links to the other articles in the series via `/blog/{slug}` links in its HTML; the homepage and `/series/[slug]` page render that hub post as the aggregator. Series tags are hidden from regular post tag chips in `PostCard`, and hub posts are excluded from Latest Posts.

## Instructions

**CRITICAL: Never commit code unless explicitly instructed to do so in the prompt.**

- Test changes before considering them complete. There are no unit or integration tests in this repo yet, so use agent-browser, Chrome DevTools MCP, or Playwright MCP to visually verify changes in the UI.
