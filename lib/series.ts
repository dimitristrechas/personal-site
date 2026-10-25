import { cache } from "react";
import { ghostClient } from "@/lib/ghost";
import { candidateSeriesTagSlugs, isSeriesTag, isSeriesTagSlug, seriesRouteSlugFromTagSlug } from "@/lib/series-tags";
import type { GhostPost, Post, Tag } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";
import type { Series } from "@/types/series";

export {
  candidateSeriesTagSlugs,
  INTERNAL_SERIES_TAG_PREFIX,
  isPublicSeriesTag,
  isSeriesTagSlug,
  SERIES_TAG_PREFIX,
  seriesRouteSlugFromTagSlug,
  seriesTagSlugFromRouteSlug,
} from "@/lib/series-tags";

type GhostSeriesTag = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  feature_image?: string | null;
  visibility: string;
  count?: { posts: number };
};

function displayNameFromTagName(name: string): string {
  return name.replace(/^#/, "").trim() || name;
}

function mapGhostTagToSeries(tag: GhostSeriesTag): Series {
  const totalTagged = tag.count?.posts ?? 0;
  // The earliest tagged post is the hub/intro; members are the rest.
  const articleCount = totalTagged > 0 ? Math.max(0, totalTagged - 1) : 0;

  return {
    id: tag.id,
    title: displayNameFromTagName(tag.name),
    slug: seriesRouteSlugFromTagSlug(tag.slug),
    description: tag.description || null,
    coverImage: tag.feature_image || null,
    articleCount,
    tagSlug: tag.slug,
  };
}

export function getSeriesTagFromPost(post: Post): Tag | undefined {
  return post.tags.find((tag) => isSeriesTag(tag));
}

export function hasSeriesTag(post: Post): boolean {
  return post.tags.some((tag) => isSeriesTag(tag));
}

/** @deprecated Hub identity is now earliest-post-with-tag; use {@link hasSeriesTag} + hub comparison. */
export function isSeriesHubPost(post: Post): boolean {
  return hasSeriesTag(post);
}

const getAllGhostPosts = cache(async (): Promise<Post[]> => {
  const response = await ghostClient.posts.browse({
    include: ["tags"],
    limit: "all",
    order: "published_at DESC",
  });

  return ((response || []) as GhostPost[]).map((ghostPost) => mapGhostPostToPost(ghostPost));
});

/** Earliest tagged post per series route slug — the hub/intro post. */
function getHubPostsBySeriesSlug(posts: Post[]): Map<string, Post> {
  const hubs = new Map<string, Post>();

  for (const post of posts) {
    const seriesTag = getSeriesTagFromPost(post);
    if (!seriesTag) continue;

    const routeSlug = seriesRouteSlugFromTagSlug(seriesTag.slug);
    const existing = hubs.get(routeSlug);

    if (!existing || new Date(post.publishedAt) < new Date(existing.publishedAt)) {
      hubs.set(routeSlug, post);
    }
  }

  return hubs;
}

const getHubPostSlugs = cache(async (): Promise<Set<string>> => {
  const hubs = getHubPostsBySeriesSlug(await getAllGhostPosts());
  return new Set([...hubs.values()].map((post) => post.slug));
});

/** Blog-feed posts: everything except hub/intro posts (series members stay visible). */
export async function getBlogPosts(limit?: number): Promise<Post[]> {
  try {
    const [allPosts, hubSlugs] = await Promise.all([getAllGhostPosts(), getHubPostSlugs()]);
    const posts = allPosts.filter((post) => !hubSlugs.has(post.slug));

    return limit ? posts.slice(0, limit) : posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/** @deprecated Use {@link getBlogPosts} — now excludes only hubs, not all tagged posts. */
export async function getPostsWithoutSeriesTag(limit?: number): Promise<Post[]> {
  return getBlogPosts(limit);
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  return getBlogPosts(limit);
}

export async function getHomepageData(latestLimit = 3): Promise<{ posts: Post[]; seriesList: Series[] }> {
  try {
    const [posts, seriesList] = await Promise.all([getBlogPosts(latestLimit), getAllSeries()]);

    return { posts, seriesList };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      posts: [],
      seriesList: [],
    };
  }
}

export async function getAllSeries(): Promise<Series[]> {
  try {
    const response = await ghostClient.tags.browse({
      limit: "all",
      include: ["count.posts"],
    });

    const tags = (response || []) as GhostSeriesTag[];

    return tags
      .filter((tag) => isSeriesTagSlug(tag.slug))
      .map(mapGhostTagToSeries)
      .toSorted((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error fetching article series:", error);
    return [];
  }
}

async function getSeriesTag(seriesSlug: string): Promise<GhostSeriesTag | null> {
  const [internalSlug, legacySlug] = candidateSeriesTagSlugs(seriesSlug);

  // Prefer a direct read of the internal tag, fall back to legacy.
  for (const slug of [internalSlug, legacySlug]) {
    try {
      const tag = (await ghostClient.tags.read({ slug }, { include: ["count.posts"] })) as GhostSeriesTag | null;
      if (tag && isSeriesTagSlug(tag.slug)) return tag;
    } catch {
      // try next candidate
    }
  }

  try {
    const response = await ghostClient.tags.browse({
      filter: `slug:[${internalSlug},${legacySlug}]`,
      limit: "all",
      include: ["count.posts"],
    });
    const tags = (response || []) as GhostSeriesTag[];
    return tags.find((tag) => isSeriesTagSlug(tag.slug)) ?? null;
  } catch (error) {
    console.error(`Error fetching series tag "${seriesSlug}":`, error);
    return null;
  }
}

export async function getSeriesHubPost(seriesSlug: string): Promise<Post | null> {
  const [internalSlug, legacySlug] = candidateSeriesTagSlugs(seriesSlug);

  try {
    const response = await ghostClient.posts.browse({
      filter: `tag:[${internalSlug},${legacySlug}]`,
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

export async function getSeriesMembers(seriesSlug: string, excludeSlug?: string): Promise<Post[]> {
  const [internalSlug, legacySlug] = candidateSeriesTagSlugs(seriesSlug);

  try {
    const response = await ghostClient.posts.browse({
      filter: `tag:[${internalSlug},${legacySlug}]`,
      include: ["tags"],
      order: "published_at ASC",
      limit: "all",
    });

    const posts = ((response || []) as GhostPost[]).map(mapGhostPostToPost);

    return excludeSlug ? posts.filter((post) => post.slug !== excludeSlug) : posts;
  } catch (error) {
    console.error(`Error fetching series members "${seriesSlug}":`, error);
    return [];
  }
}

export async function getSeriesBySlug(seriesSlug: string): Promise<Series | null> {
  const tag = await getSeriesTag(seriesSlug);
  if (!tag) {
    // Fallback for tags API hiccups: derive from hub post grouping.
    const hubPost = await getSeriesHubPost(seriesSlug);
    if (!hubPost) return null;
    const seriesTag = getSeriesTagFromPost(hubPost);
    if (!seriesTag) return null;
    return {
      id: seriesTag.id,
      title: hubPost.title,
      slug: seriesSlug,
      description: hubPost.description || null,
      coverImage: hubPost.featuredImage,
      articleCount: 0,
      tagSlug: seriesTag.slug,
    };
  }

  // Prefer hub excerpt/cover when the tag itself has no metadata yet.
  if (!tag.description || !tag.feature_image) {
    const hubPost = await getSeriesHubPost(seriesSlug);
    return {
      ...mapGhostTagToSeries(tag),
      description: tag.description || hubPost?.description || null,
      coverImage: tag.feature_image || hubPost?.featuredImage || null,
    };
  }

  return mapGhostTagToSeries(tag);
}

export async function getSeriesPageData(seriesSlug: string): Promise<{
  series: Series | null;
  hubPost: Post | null;
  members: Post[];
}> {
  const [series, hubPost] = await Promise.all([getSeriesBySlug(seriesSlug), getSeriesHubPost(seriesSlug)]);

  if (!series || !hubPost) {
    return { series, hubPost, members: [] };
  }

  const members = await getSeriesMembers(seriesSlug, hubPost.slug);

  return { series, hubPost, members };
}
