import matter from "gray-matter";
import hljs from "highlight.js";
import marked from "marked";
import { GetStaticProps } from "next";
import Head from "next/head";
import React, { FC } from "react";
import { FaVolumeUp } from "react-icons/fa";

marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlight(lang, code).value;
  },
});

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/about`);

  const about: About = await res.json();
  const parsedMarkdown = matter(about.content);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, about },
  };
};

type InputProps = {
  htmlString: string;
  about: About;
};

const About: FC<InputProps> = ({ htmlString, about }: InputProps) => {
  console.log("about", about);
  return (
    <>
      <Head>
        <title>{about.title}</title>
      </Head>
      <div className="row">
        <div className="col">
          <div className="markdown-custom py-5" dangerouslySetInnerHTML={{ __html: htmlString }} />
        </div>
      </div>
    </>
  );
};

export default About;
