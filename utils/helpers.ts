import type { Post } from "@/types/post";

export const normalizeText = (input: string | null | undefined): string => {
  if (!input) return "";

  try {
    return input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  } catch (error) {
    console.error("normalizeText error:", error);
    return "";
  }
};

export const createSearchMatcher = (query: string) => {
  const normalized = normalizeText(query);

  return (post: Post): boolean => {
    if (!normalized) return true;

    if (normalizeText(post.title).includes(normalized)) return true;

    return post.tags.some((tag) => normalizeText(tag.title).includes(normalized));
  };
};
