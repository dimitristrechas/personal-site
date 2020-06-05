import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";

const Home = ({ posts }) => {
  console.log("posts", posts);
  return (
    <>
      {posts.map((post) => {
        return (
          <div key={post.slug}>
            <Link href="/blog/[slug]" as={"/blog/" + post.slug}>
              <a>{post.title}</a>
            </Link>
          </div>
        );
      })}
    </>
  );
};

export const getStaticProps = async () => {
  const files = fs.readdirSync("posts");

  const posts = files.map((filename) => {
    const markdown = fs.readFileSync(path.join("posts", filename)).toString();
    const parsedMarkdown = matter(markdown);

    return {
      slug: filename.replace(".md", ""),
      title: parsedMarkdown.data.title,
    };
  });

  return {
    props: {
      posts,
    },
  };
};

export default Home;
