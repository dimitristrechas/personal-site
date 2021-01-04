type Post = {
  title: string;
  content: string;
  description: string;
  published_at: string;
  createdAt: string;
  tag: string;
  _id: string;
  tags: Tag[];
};

type Tag = {
  title: string;
  color: string;
  id: string;
};

type PageData = { title: string };
