type Post = {
  title: string;
  content: string;
  description: string;
  published_at: string;
  createdAt: string;
  tag: string;
  _id: string;
};

type PostProps = { posts: Post[] };

type PageData = { title: string };

type PageProps = {
  htmlString: string;
  post: PageData;
};

type BlogProps = {
  htmlString: string;
  post: Post;
};
