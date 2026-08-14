export type Series = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  articleCount: number;
  hubPostSlug: string;
};
