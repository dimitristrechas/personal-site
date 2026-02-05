export type GhostPage = {
  id: string;
  title: string;
  slug: string;
  html: string;
  custom_excerpt?: string | null;
  feature_image?: string | null;
  featured: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
  published_at: string;
  url: string;
};

export type Page = {
  id: string;
  title: string;
  content: string;
};

export function mapGhostPageToPage(ghostPage: GhostPage): Page {
  return {
    id: ghostPage.id,
    title: ghostPage.title,
    content: ghostPage.html,
  };
}
