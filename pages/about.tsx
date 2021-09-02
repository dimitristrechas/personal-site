import matter from "gray-matter";
import marked from "marked";
import { GetStaticProps } from "next";
import Head from "next/head";
import React, { FC } from "react";

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
      <article className="prose" dangerouslySetInnerHTML={{ __html: htmlString }} />
    </>
  );
};

export default About;
