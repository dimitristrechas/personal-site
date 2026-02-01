import { parse } from "node-html-parser";

const isExternalLink = (href: string): boolean => {
  if (!href.startsWith("http://") && !href.startsWith("https://")) return false;

  const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN;
  if (!siteDomain) return true;

  try {
    const url = new URL(href);
    return url.hostname !== siteDomain;
  } catch {
    return true;
  }
};

export async function processGhostHtml(html: string): Promise<string> {
  try {
    const root = parse(html);
    const links = root.querySelectorAll("a");

    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) continue;

      if (isExternalLink(href)) {
        const existingRel = link.getAttribute("rel");
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", existingRel ? `${existingRel} noopener noreferrer` : "noopener noreferrer");

        const currentHtml = link.innerHTML;
        link.innerHTML = `${currentHtml} <span>↗</span><span class="sr-only"> (opens in new tab)</span>`;
      }
    }

    return root.toString();
  } catch (error) {
    console.error("Error processing Ghost HTML:", error);
    return html;
  }
}
