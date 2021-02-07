import matter from "gray-matter";
import hljs from "highlight.js";
import marked from "marked";
import { GetStaticProps } from "next";
import Head from "next/head";
import React, { FC } from "react";

marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlight(lang, code).value;
  },
});

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/about`);

  const aboutData: AboutPage = await res.json();
  const parsedMarkdown = matter(aboutData.content);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, aboutData },
  };
};

type InputProps = {
  htmlString: string;
  aboutData: AboutPage;
};

const About: FC<InputProps> = ({ htmlString, aboutData }: InputProps) => {
  return (
    <>
      <Head>
        <title>{aboutData.title}</title>
      </Head>
      <div className="row m-0">
        <div className="col">
          <div className="markdown-custom py-5" dangerouslySetInnerHTML={{ __html: htmlString }} />
        </div>
      </div>
    </>
  );
};

export default About;
