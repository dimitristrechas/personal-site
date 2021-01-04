import matter from "gray-matter";
import highlightjs from "highlight.js";
import marked, { Renderer } from "marked";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { FC } from "react";

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeForHTML(input) {
  return input.replace(/([&<>'"])/g, (char) => escapeMap[char]);
}

const renderer = new Renderer();
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language));

  // Highlight only if the language is valid.
  // highlight.js escapes HTML in the code, but we need to escape by ourselves
  // when we don't use it.
  const highlighted = validLang ? highlightjs.highlight(language, code).value : escapeForHTML(code);

  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.setOptions({ renderer });

export const getStaticPaths = async (): Promise<unknown> => {
  const res = await fetch(`${process.env.API_ENDPOINT}/posts/`);
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  const res = await fetch("https://dimitristrechas-strapi.herokuapp.com/posts/" + id);

  const post: Post = await res.json();
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
      </Head>
      <div className="markdown-custom py-5" dangerouslySetInnerHTML={{ __html: htmlString }} />
      <div className="text-right py-1">
        <Link href="/blog" as={"/blog"}>
          <a>back to blog list</a>
        </Link>
      </div>
    </>
  );
};

export default Post;
