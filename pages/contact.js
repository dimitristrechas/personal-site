import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import marked from "marked";

const Contact = ({ htmlString, data }) => {
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    </>
  );
};

export const getStaticProps = async () => {
  const markdown = fs
    .readFileSync(path.join("sections", "contact.md"))
    .toString();
  const parsedMarkdown = matter(markdown);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, data: parsedMarkdown.data },
  };
};

export default Contact;
