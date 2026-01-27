import matter from "gray-matter";
import { marked } from "marked";

marked.use({
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${title}"` : "";
      const isExternal = href.startsWith("http");
      return isExternal
        ? `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text} <span>↗</span><span class="sr-only"> (opens in new tab)</span></a>`
        : `<a href="${href}"${titleAttr}>${text}</a>`;
    },
  },
});

export const parseMarkdown = (content: string) => marked(matter(content).content);
