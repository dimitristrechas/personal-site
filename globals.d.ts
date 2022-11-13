type Post = {
  id: string;
  attributes: {
    title: string;
    content: string;
    description: string;
    publishedAt: string;
    createdAt: string;
    tags: {
      data: Tag[];
    };
    slug: string;
  };
};

type Tag = {
  id: string;
  attributes: {
    title: string;
    color: string;
  };
};

type PageData = { title: string };

type ContactPage = {
  data: {
    id: string;
    attributes: {
      content: string;
      title: string;
    };
  };
};

type AboutPage = {
  data: {
    id: string;
    attributes: {
      content: string;
      title: string;
    };
  };
};
