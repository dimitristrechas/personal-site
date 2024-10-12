type Post = {
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

type Tag = {
  id: string;
  title: string;
  color: string;
};

type PageData = { title: string };

type ContactPage = {
  data: {
    id: string;
    content: string;
    title: string;
  };
};

type AboutPage = {
  data: {
    id: string;
    content: string;
    title: string;
  };
};
