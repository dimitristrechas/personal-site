import type { Post } from "@/types/post";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export const formatDate = (isoDate: string): string => dateFormatter.format(new Date(isoDate));

export const pluralize = (count: number, noun: string): string => `${count} ${count === 1 ? noun : `${noun}s`}`;

export const normalizeText = (input: string | null | undefined): string =>
  input ? input.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase() : "";

export const createSearchMatcher = (query: string) => {
  const normalized = normalizeText(query.trim());

  return (post: Post): boolean => {
    if (!normalized) return true;

    if (normalizeText(post.title).includes(normalized)) return true;

    return post.tags.some((tag) => normalizeText(tag.title).includes(normalized));
  };
};
