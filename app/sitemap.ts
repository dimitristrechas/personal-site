import type { MetadataRoute } from "next";
import { getAllSeries, getPostsWithoutSeriesTag } from "@/lib/series";
import { getSiteUrl } from "@/lib/site";
import type { Post } from "@/types/post";
import type { Series } from "@/types/series";

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
    const [posts, seriesList] = await Promise.all([getPostsWithoutSeriesTag(), getAllSeries()]);

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post: Post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    }));

    const seriesRoutes: MetadataRoute.Sitemap = seriesList.map((series: Series) => ({
      url: `${siteUrl}/series/${series.slug}`,
      lastModified: new Date(),
    }));

    return [...staticRoutes, ...blogRoutes, ...seriesRoutes];
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
    return staticRoutes;
  }
}
