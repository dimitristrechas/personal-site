import { parse } from "node-html-parser";

const isExternalLink = (href: string): boolean => {
  if (!href.startsWith("http://") && !href.startsWith("https://")) return false;

  const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN;
  if (!siteDomain) return true;

  try {
    const url = new URL(href);
    return !url.hostname.includes(siteDomain);
  } catch {
    return true;
  }
};

const ghostOrigin = (() => {
  try {
    return process.env.GHOST_URL ? new URL(process.env.GHOST_URL).origin : null;
  } catch {
    return null;
  }
})();

const INTERNAL_PATH_PREFIXES = ["/blog", "/about", "/contact", "/series/"];

const isInternalSitePath = (pathname: string): boolean =>
  pathname === "/" ||
  INTERNAL_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix.replace(/\/$/, "")}/`));

export async function processGhostHtml(html: string): Promise<string> {
  try {
    const root = parse(html);
    const links = root.querySelectorAll("a");

    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) continue;

      // Ghost absolutizes relative /blog/{slug} links to its own origin on
      // save; point them back at the site so they don't 404 on Ghost itself.
      // The same applies to the homepage (/) and other site routes. Other
      // Ghost-origin links and image/content URLs are intentionally left untouched.
      if (ghostOrigin && href.startsWith("http")) {
        try {
          const url = new URL(href);
          if (url.origin === ghostOrigin && isInternalSitePath(url.pathname)) {
            link.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
            continue;
          }
          if (url.searchParams.get("ref") === "localhost") {
            url.searchParams.delete("ref");
            link.setAttribute("href", url.toString());
          }
        } catch {
          // keep original href
        }
      }

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
