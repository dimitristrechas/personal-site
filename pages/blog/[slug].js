import fs from "fs";
import matter from "gray-matter";
import marked from "marked";
import Head from "next/head";
import path from "path";
import React from "react";
import Link from "next/link";

const Post = ({ htmlString, data }) => {
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div
        className="markdown-custom py-5"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
      <div className="text-right py-1">
        <Link href="/blog" as={"/blog"}>
          <a>back to blog list</a>
        </Link>
      </div>
    </>
  );
};

export const getStaticPaths = async () => {
  const files = fs.readdirSync("posts");

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const markdown = fs.readFileSync(path.join("posts", slug + ".md")).toString();
  const parsedMarkdown = matter(markdown);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, data: parsedMarkdown.data },
  };
};

export default Post;
