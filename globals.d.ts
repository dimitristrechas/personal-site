type Post = {
  title: string;
  content: string;
  description: string;
  published_at: string;
  createdAt: string;
  tag: string;
  _id: string;
  tags: Tag[];
  slug: string;
};

type Tag = {
  title: string;
  color: string;
  id: string;
};

type PageData = { title: string };

type Contact = {
  id: string;
  content: string;
  title: string;
};

type About = {
  id: string;
  content: string;
  title: string;
};
