import type { MetadataRoute } from "next";

export const revalidate = 3600; // ISR: revalidate every 1 hour

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
    const res = await fetch(`${process.env.API_ENDPOINT}/posts?populate=%2A&sort[1]=createdAt%3Adesc`);
    const posts: Post[] = await res.json().then((data) => data.data);

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `https://dimitristrechas.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    // Fallback to static routes if Strapi is unreachable
    console.error("Failed to fetch blog posts for sitemap:", error);
    return staticRoutes;
  }
}
