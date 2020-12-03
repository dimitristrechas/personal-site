import matter from "gray-matter";
import highlightjs from "highlight.js";
import marked, { Renderer } from "marked";
import { GetServerSideProps } from "next";
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

export const getServerSideProps: GetServerSideProps = async ({ params: { id } }) => {
  const res = await fetch("https://dimitristrechas-strapi.herokuapp.com/posts/" + id);

  const post: Post = await res.json();
  const parsedMarkdown = matter(post.content);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, post },
  };
};

const Post: FC<PageProps> = ({ htmlString, post }: PageProps) => {
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
