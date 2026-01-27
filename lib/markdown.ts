import matter from "gray-matter";
import { marked } from "marked";

marked.use({
  renderer: {
    link(token) {
      const href = token.href;
      const text = this.parser.parseInline(token.tokens);
      const title = token.title;

      const isExternal = href.startsWith("http://") || href.startsWith("https://");

      if (isExternal) {
        let html = `<a href="${href}"`;
        if (title) html += ` title="${title}"`;
        html += ' target="_blank" rel="noopener noreferrer">';
        html += `${text}↗<span class="sr-only"> (opens in new tab)</span></a>`;
        return html;
      }

      let html = `<a href="${href}"`;
      if (title) html += ` title="${title}"`;
      html += `>${text}</a>`;
      return html;
    },
  },
});

export async function parseMarkdown(content: string): Promise<string> {
  const { content: markdown } = matter(content);
  const htmlString = await marked(markdown);
  return htmlString;
}
