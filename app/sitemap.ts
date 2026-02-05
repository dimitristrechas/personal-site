import type { MetadataRoute } from "next";
import { ghostClient } from "@/lib/ghost";
import type { GhostPost, Post } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://dimitristrechas.com",
      lastModified: new Date(),
    },
    {
      url: "https://dimitristrechas.com/about",
      lastModified: new Date(),
    },
    {
      url: "https://dimitristrechas.com/contact",
      lastModified: new Date(),
    },
    {
      url: "https://dimitristrechas.com/blog",
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
      url: `https://dimitristrechas.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    // Fallback to static routes if Ghost is unreachable
    console.error("Failed to fetch blog posts for sitemap:", error);
    return staticRoutes;
  }
}
