import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const AI_CRAWLERS = ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "Claude-Web", "Google-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [...AI_CRAWLERS.map((userAgent) => ({ userAgent, disallow: "/" })), { userAgent: "*", allow: "/" }],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
