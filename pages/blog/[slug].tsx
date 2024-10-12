import matter from "gray-matter";
import { marked } from "marked";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { FC } from "react";

import { ParsedUrlQuery } from "querystring";

interface Params extends ParsedUrlQuery {
  id: string;
}

const escapeMap: { [symbol: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeForHTML(input: string) {
  return input.replace(/([&<>'"])/g, (char) => escapeMap[char]);
}

export const getStaticPaths = async (): Promise<unknown> => {
  const res = await fetch(`${process.env.API_ENDPOINT}/posts/`);
  const posts = await res.json().then((data) => data.data);

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as Params;
  const res = await fetch(
    `${process.env.API_ENDPOINT}/posts/?filters[slug][$eq]=${slug}`
  );
  const data = await res.json().then((data) => data.data);

  const post: Post = data ? data[0] : null;

  const parsedMarkdown = matter(post.content);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, post },
  };
};

type InputProps = {
  htmlString: string;
  post: Post;
};

const Post: FC<InputProps> = ({ htmlString, post }: InputProps) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta property="og:title" content={`Dimitris Trechas`} />
        <meta property="og:description" content={post.title}></meta>
        <meta
          data-react-helmet="true"
          property="og:type"
          content="article"
        ></meta>
        <meta
          property="og:image"
          name="image"
          itemProp="image"
          content="https://dimitristrechas.com/bomberman-medium.jpg"
        ></meta>
        <meta
          property="og:image:secure_url"
          content="https://dimitristrechas.com/bomberman-medium.jpg"
        ></meta>
        <meta property="og:image:type" content="image/jpeg"></meta>
        <meta property="og:image:alt" content="dimitristrechas.com"></meta>
        <meta
          property="og:url"
          content={`https://dimitristrechas.com/blog/${post.slug}`}
        ></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <article
        className="prose py-5"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
      <div className="text-right py-1">
        <Link href="/blog">back to blog list</Link>
      </div>
    </>
  );
};

export default Post;
