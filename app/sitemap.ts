import type { MetadataRoute } from "next";
import { ghostClient } from "@/lib/ghost";
import { getSiteUrl } from "@/lib/site";
import type { GhostPost, Post } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
    },
  ];

  try {
    const response = await ghostClient.posts.browse({
      limit: "all",
      fields: ["slug", "updated_at"],
      order: "published_at DESC",
    });

    const posts = ((response || []) as GhostPost[]).map((p) => mapGhostPostToPost(p));

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post: Post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
    return staticRoutes;
  }
}
