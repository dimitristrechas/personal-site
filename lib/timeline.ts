import { parse } from "node-html-parser";

// Company logos (public-domain text logos from Wikimedia Commons,
// self-hosted under public/logos). Matched against Ghost "about" page
// h2 headings by keyword; headings without a match are left untouched.
export const COMPANY_LOGOS = [
  {
    keywords: ["clickdelivery", "efood"],
    src: "/logos/efood.svg",
    alt: "",
  },
  {
    keywords: ["singularlogic"],
    src: "/logos/singularlogic.svg",
    alt: "",
  },
  {
    keywords: ["skroutz"],
    src: "/logos/skroutz.svg",
    alt: "",
  },
  {
    keywords: ["deutsche telekom", "telekom"],
    src: "/logos/deutsche-telekom.svg",
    alt: "",
  },
] as const;

/** Month names (full and abbreviated) accepted in trailing h2 date ranges. */
const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec";

/** Trailing date range in h2 headings, e.g. ", August 2023–Present". */
const PERIOD_PATTERN = new RegExp(
  `,\\s*((?:${MONTHS})\\s+\\d{4}\\s*[–—-]\\s*(?:(?:${MONTHS})\\s+\\d{4}|Present))\\s*$`,
);

/**
 * Enhances Ghost "about" HTML into a career timeline:
 * - prepends a company logo badge to each h2 heading matching a known company
 * - moves a trailing date range out of the heading into a grey period subtitle
 * - wraps the intro + roles in a .timeline container (which carries the rail)
 *   and trailing sections (e.g. projects) in .about-sections, so the rail
 *   ends with the last role instead of running through the whole page
 */
export function enhanceTimelineHtml(html: string): string {
  try {
    const root = parse(html);
    for (const heading of root.querySelectorAll("h2")) {
      const text = heading.text.toLowerCase();
      const company = COMPANY_LOGOS.find((c) => c.keywords.some((k) => text.includes(k)));
      if (!company) continue;
      heading.innerHTML = `<img src="${company.src}" alt="${company.alt}" aria-hidden="true" class="timeline-logo" />${heading.innerHTML}`;
      const periodMatch = heading.innerHTML.match(PERIOD_PATTERN);
      if (periodMatch) {
        heading.innerHTML = heading.innerHTML.replace(PERIOD_PATTERN, "");
        heading.insertAdjacentHTML("afterend", `<p class="timeline-period">${periodMatch[1]}</p>`);
      }
    }
    const children = root.childNodes;
    const tagNameOf = (node: (typeof children)[number]): string | null =>
      node.nodeType === 1 ? ((node as unknown as HTMLElement).tagName ?? null) : null;
    const isRole = (node: (typeof children)[number]) => tagNameOf(node)?.toUpperCase() === "H2";
    const firstRoleIndex = children.findIndex((node) => isRole(node));
    let lastRoleIndex = -1;
    children.forEach((node, index) => {
      if (isRole(node)) {
        lastRoleIndex = index;
      }
    });
    const splitAt = children.findIndex(
      (node, index) => index > lastRoleIndex && tagNameOf(node)?.toUpperCase() === "H3",
    );
    const serialize = (nodes: typeof children) => nodes.map((node) => node.toString()).join("");
    if (firstRoleIndex === -1) {
      root.innerHTML = `<div class="timeline">${serialize(children)}</div>`;
    } else {
      const intro = children.slice(0, firstRoleIndex);
      const timelineNodes = children.slice(firstRoleIndex, splitAt === -1 ? undefined : splitAt);
      const extraNodes = splitAt === -1 ? [] : children.slice(splitAt);
      root.innerHTML =
        serialize(intro) +
        `<div class="timeline">${serialize(timelineNodes)}</div>` +
        (extraNodes.length > 0 ? `<div class="about-sections">${serialize(extraNodes)}</div>` : "");
    }
    return root.toString();
  } catch (error) {
    console.error("Error enhancing timeline HTML:", error);
    return html;
  }
}
