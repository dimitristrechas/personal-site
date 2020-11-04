import fs from "fs";
import matter from "gray-matter";
import hljs from "highlight.js";
import marked from "marked";
import { GetStaticProps } from "next";
import Head from "next/head";
import path from "path";
import React, { FC } from "react";

marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlight(lang, code).value;
  },
});

type AboutData = { title: string };

type AboutProps = {
  htmlString: string;
  data: AboutData;
};

const About: FC<AboutProps> = ({ htmlString, data }: AboutProps) => {
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div className="row">
        <div className="col">
          <div className="markdown-custom py-5" dangerouslySetInnerHTML={{ __html: htmlString }} />
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const markdown = fs.readFileSync(path.join("sections", "about.md")).toString();
  const parsedMarkdown = matter(markdown);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, data: parsedMarkdown.data },
  };
};

export default About;
