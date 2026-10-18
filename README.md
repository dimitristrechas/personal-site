The code behind [my personal site/blog Next.js web app](https://www.dimitristrechas.com).

# INSTALLATION NOTES

1. clone repo `git clone https://github.com/dimitristrechas/personal-site.git`
2. Copy `.env.example` to `.env` and set ENV variables
3. Set MCP token environment variables in shell profile (~/.zshrc or ~/.bashrc):
   - `export GITHUB_MCP_TOKEN=<your-token>`
   - `export LINEAR_MCP_TOKEN=<your-token>`
   - `export CONTEXT7_API_KEY=<your-token>`
   - `export CLOUDFLARE_API_TOKEN=<your-token>`
   - `export DOKPLOY_URL=<dokploy-base-url>` (base URL only, no `/api`)
   - `export DOKPLOY_API_KEY=<your-token>`
   (Exa and Cloudflare Docs need no auth. Config files that must stay in sync: `opencode.json`, `.mcp.json`, `.cursor/mcp.json`.)
4. `npm install && npm run dev`
