type Post = {
  slug: string;
  title: string;
  date: string;
  timestamp: number;
  tags: string[];
};

type PostProps = { posts: Post[] };
