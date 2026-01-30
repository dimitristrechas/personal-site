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
  color: string;
};
