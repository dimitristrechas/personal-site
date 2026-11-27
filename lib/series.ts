import { cache } from "react";
import { ghostClient } from "@/lib/ghost";
import { getAllPosts } from "@/lib/posts";
import { candidateSeriesTagSlugs, isSeriesTagSlug, seriesRouteSlugFromTagSlug } from "@/lib/series-tags";
import type { GhostPost, Post, Tag } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";
import type { Series } from "@/types/series";

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
  const articleCount = Math.max(0, totalTagged - 1);

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
  return post.tags.find((tag) => isSeriesTagSlug(tag.slug));
}

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
  const hubs = getHubPostsBySeriesSlug(await getAllPosts());
  return new Set([...hubs.values()].map((post) => post.slug));
});

/** Blog-feed posts: everything except hub/intro posts (series members stay visible). */
export async function getBlogPosts(limit?: number): Promise<Post[]> {
  try {
    const [allPosts, hubSlugs] = await Promise.all([getAllPosts(), getHubPostSlugs()]);
    const posts = allPosts.filter((post) => !hubSlugs.has(post.slug));

    return limit ? posts.slice(0, limit) : posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getHomepageData(latestLimit = 3): Promise<{ posts: Post[]; seriesList: Series[] }> {
  const [posts, seriesList] = await Promise.all([getBlogPosts(latestLimit), getAllSeries()]);
  return { posts, seriesList };
}

export const getAllSeries = cache(async (): Promise<Series[]> => {
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
});

type SeriesTagLookup = { tag: GhostSeriesTag | null; failed: boolean };

const getSeriesTag = cache(async (seriesSlug: string): Promise<SeriesTagLookup> => {
  const candidates = candidateSeriesTagSlugs(seriesSlug);

  try {
    const response = await ghostClient.tags.browse({
      filter: `slug:[${candidates.join(",")}]`,
      limit: "all",
      include: ["count.posts"],
    });
    const tags = (response || []) as GhostSeriesTag[];

    for (const slug of candidates) {
      const tag = tags.find((candidate) => candidate.slug === slug);
      if (tag) return { tag, failed: false };
    }
    return { tag: null, failed: false };
  } catch (error) {
    console.error(`Error fetching series tag "${seriesSlug}":`, error);
    return { tag: null, failed: true };
  }
});

const getSeriesPosts = cache(async (seriesSlug: string): Promise<Post[]> => {
  try {
    const response = await ghostClient.posts.browse({
      filter: `tag:[${candidateSeriesTagSlugs(seriesSlug).join(",")}]`,
      include: ["tags"],
      order: "published_at ASC",
      limit: "all",
    });

    return ((response || []) as GhostPost[]).map(mapGhostPostToPost);
  } catch (error) {
    console.error(`Error fetching series posts "${seriesSlug}":`, error);
    return [];
  }
});

export async function getSeriesHubPost(seriesSlug: string): Promise<Post | null> {
  const [hubPost] = await getSeriesPosts(seriesSlug);
  return hubPost ?? null;
}

export const getSeriesPageData = cache(
  async (
    seriesSlug: string,
  ): Promise<{
    series: Series | null;
    hubPost: Post | null;
    members: Post[];
  }> => {
    const [{ tag, failed }, [hubPost = null, ...members]] = await Promise.all([
      getSeriesTag(seriesSlug),
      getSeriesPosts(seriesSlug),
    ]);

    if (!tag) {
      // A failed tags request should not hide a series whose posts loaded; derive it from the hub.
      const candidates = candidateSeriesTagSlugs(seriesSlug);
      const hubTag = failed ? hubPost?.tags.find((t) => candidates.includes(t.slug)) : undefined;
      if (!hubPost || !hubTag) return { series: null, hubPost, members: [] };

      const series: Series = {
        id: hubTag.id,
        title: displayNameFromTagName(hubTag.title),
        slug: seriesSlug,
        description: hubPost.description || null,
        coverImage: hubPost.featuredImage || null,
        articleCount: members.length,
        tagSlug: hubTag.slug,
      };
      return { series, hubPost, members };
    }

    const series: Series = {
      ...mapGhostTagToSeries(tag),
      // Prefer hub excerpt/cover when the tag itself has no metadata yet.
      description: tag.description || hubPost?.description || null,
      coverImage: tag.feature_image || hubPost?.featuredImage || null,
    };

    return { series, hubPost, members };
  },
);
