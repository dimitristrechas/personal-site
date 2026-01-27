import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Block AI/ML crawlers
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "Claude-Web",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      // Allow all other crawlers
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://dimitristrechas.com/sitemap.xml",
  };
}

// This replaces the invalid Content-Signal directive per RFC 9309.
// Valid directives: user-agent, allow, disallow, sitemap.
// Content-Signal is not an RFC-compliant directive.
