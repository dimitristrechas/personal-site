import matter from "gray-matter";
import { marked, type RendererObject, type Tokens } from "marked";
import { headers } from "next/headers";

const isExternalLink = (href: string, currentHost?: string): boolean => {
  if (!currentHost) {
    return true;
  }

  if (!href.startsWith("http://") && process.env.NODE_ENV === "production") {
    return false;
  }

  try {
    const url = new URL(href);
    return url.hostname !== currentHost;
  } catch {
    return true;
  }
};

const createRenderer = (currentHost?: string): RendererObject => {
  return {
    link(token: Tokens.Link): string {
      const text = token.text;
      const titleAttr = token.title ? ` title="${token.title}"` : "";
      const isExternal = isExternalLink(token.href, currentHost);

      return isExternal
        ? `<a href="${token.href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text} <span>↗</span><span class="sr-only"> (opens in new tab)</span></a>`
        : `<a href="${token.href}"${titleAttr}>${text}</a>`;
    },
  };
};

export const parseMarkdown = async (content: string) => {
  const headersList = await headers();
  const currentHost = headersList.get("host")?.split(":")[0];
  console.log("Current Host:", currentHost);
  marked.use({ renderer: createRenderer(currentHost) });
  return marked(matter(content).content);
};
