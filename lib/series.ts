import { parse } from "node-html-parser";
import { cache } from "react";
import { ghostClient } from "@/lib/ghost";
import {
  isPublicSeriesTag,
  isSeriesTagSlug,
  seriesRouteSlugFromTagSlug,
  seriesTagSlugFromRouteSlug,
} from "@/lib/series-tags";
import type { GhostPost, Post, Tag } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";
import type { Series } from "@/types/series";

export {
  isPublicSeriesTag,
  isSeriesTagSlug,
  SERIES_TAG_PREFIX,
  seriesRouteSlugFromTagSlug,
  seriesTagSlugFromRouteSlug,
} from "@/lib/series-tags";

export function getSeriesTagFromPost(post: Post): Tag | undefined {
  return post.tags.find((tag) => isPublicSeriesTag(tag));
}

export function hasSeriesTag(post: Post): boolean {
  return post.tags.some((tag) => isPublicSeriesTag(tag));
}

/** @deprecated Use {@link hasSeriesTag} */
export function isSeriesHubPost(post: Post): boolean {
  return hasSeriesTag(post);
}

function blogSlugFromHref(href: string): string | null {
  try {
    const url =
      href.startsWith("http://") || href.startsWith("https://") ? new URL(href) : new URL(href, "https://example.com");
    const match = url.pathname.match(/^\/blog\/([^/]+)\/?$/);

    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function extractBlogSlugsFromHtml(html: string, excludeSlug?: string): string[] {
  const root = parse(html);
  const slugs: string[] = [];
  const seen = new Set<string>();

  for (const link of root.querySelectorAll("a")) {
    const href = link.getAttribute("href");
    if (!href) continue;

    const slug = blogSlugFromHref(href);
    if (!slug || slug === excludeSlug || seen.has(slug)) continue;

    seen.add(slug);
    slugs.push(slug);
  }

  return slugs;
}

function mapHubPostToSeries(post: Post): Series | null {
  const seriesTag = getSeriesTagFromPost(post);
  if (!seriesTag) return null;

  return {
    id: post.id,
    title: post.title,
    slug: seriesRouteSlugFromTagSlug(seriesTag.slug),
    description: post.description || null,
    coverImage: post.featuredImage,
    articleCount: extractBlogSlugsFromHtml(post.content, post.slug).length,
    hubPostSlug: post.slug,
  };
}

function getSeriesListFromPosts(posts: Post[]): Series[] {
  const hubPostsBySeriesSlug = new Map<string, Post>();

  for (const post of posts) {
    const seriesTag = getSeriesTagFromPost(post);
    if (!seriesTag) continue;

    const routeSlug = seriesRouteSlugFromTagSlug(seriesTag.slug);
    const existingHubPost = hubPostsBySeriesSlug.get(routeSlug);

    if (!existingHubPost || new Date(post.publishedAt) < new Date(existingHubPost.publishedAt)) {
      hubPostsBySeriesSlug.set(routeSlug, post);
    }
  }

  return [...hubPostsBySeriesSlug.values()]
    .map((post) => mapHubPostToSeries(post))
    .filter((series): series is Series => series !== null)
    .toSorted((a, b) => a.title.localeCompare(b.title));
}

const getAllGhostPosts = cache(async (): Promise<Post[]> => {
  const response = await ghostClient.posts.browse({
    include: ["tags"],
    limit: "all",
    order: "published_at DESC",
  });

  return ((response || []) as GhostPost[]).map((ghostPost) => mapGhostPostToPost(ghostPost));
});

export async function getHomepageData(latestLimit = 3): Promise<{ posts: Post[]; seriesList: Series[] }> {
  try {
    const allPosts = await getAllGhostPosts();

    return {
      posts: allPosts.filter((post) => !hasSeriesTag(post)).slice(0, latestLimit),
      seriesList: getSeriesListFromPosts(allPosts),
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      posts: [],
      seriesList: [],
    };
  }
}

export async function getPostsWithoutSeriesTag(limit?: number): Promise<Post[]> {
  try {
    const posts = (await getAllGhostPosts()).filter((post) => !hasSeriesTag(post));

    return limit ? posts.slice(0, limit) : posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  return getPostsWithoutSeriesTag(limit);
}

export async function getAllSeries(): Promise<Series[]> {
  try {
    return getSeriesListFromPosts(await getAllGhostPosts());
  } catch (error) {
    console.error("Error fetching article series:", error);
    return [];
  }
}

export async function getSeriesHubPost(seriesSlug: string): Promise<Post | null> {
  const tagSlug = seriesTagSlugFromRouteSlug(seriesSlug);

  try {
    const response = await ghostClient.posts.browse({
      filter: `tag:${tagSlug}`,
      include: ["tags"],
      order: "published_at ASC",
      limit: 1,
    });

    const posts = (response || []) as GhostPost[];
    if (posts.length === 0) return null;

    const post = mapGhostPostToPost(posts[0]);

    return hasSeriesTag(post) ? post : null;
  } catch (error) {
    console.error(`Error fetching series hub post "${seriesSlug}":`, error);
    return null;
  }
}

export async function getSeriesBySlug(seriesSlug: string): Promise<Series | null> {
  const hubPost = await getSeriesHubPost(seriesSlug);
  if (!hubPost) return null;

  return mapHubPostToSeries(hubPost);
}
