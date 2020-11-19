type Post = {
  slug: string;
  title: string;
  date: string;
  timestamp: number;
  tags: string[];
};

type PostProps = { posts: Post[] };

type PageData = { title: string };

type PageProps = {
  htmlString: string;
  data: PageData;
};
