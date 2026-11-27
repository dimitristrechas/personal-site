import { cache } from "react";
import { ghostClient } from "@/lib/ghost";
import type { GhostPost, Post } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const response = await ghostClient.posts.browse({
    include: ["tags"],
    limit: "all",
    order: "published_at DESC",
  });

  return ((response || []) as GhostPost[]).map(mapGhostPostToPost);
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const response = await ghostClient.posts.read({ slug }, { include: ["tags"] });
    return response ? mapGhostPostToPost(response as GhostPost) : null;
  } catch (error) {
    console.error(`Error fetching post "${slug}":`, error);
    return null;
  }
});
