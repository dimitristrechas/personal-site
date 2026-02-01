export type Post = {
  id: string;
  title: string;
  content: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  tags: Tag[];
  slug: string;
};

export type Tag = {
  id: string;
  title: string;
  color?: string | null;
};

export type GhostPost = {
  id: string;
  title: string;
  html: string;
  custom_excerpt?: string | null;
  published_at: string;
  updated_at: string;
  created_at: string;
  tags?: GhostTag[];
  slug: string;
};

export type GhostTag = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  feature_image?: string | null;
  visibility: string;
  meta_title?: string | null;
  meta_description?: string | null;
  url: string;
  accent_color?: string | null;
};

export function mapGhostPostToPost(ghostPost: GhostPost): Post {
  return {
    id: ghostPost.id,
    title: ghostPost.title,
    content: ghostPost.html,
    description: ghostPost.custom_excerpt || "",
    publishedAt: ghostPost.published_at,
    updatedAt: ghostPost.updated_at,
    createdAt: ghostPost.created_at,
    tags: (ghostPost.tags || []).map((tag) => ({
      id: tag.id,
      title: tag.name,
      color: tag.accent_color,
    })),
    slug: ghostPost.slug,
  };
}
