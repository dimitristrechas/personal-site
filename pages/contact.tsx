import matter from "gray-matter";
import marked from "marked";
import { GetStaticProps } from "next";
import Head from "next/head";
import React, { FC } from "react";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/contact`);

  const contactData: ContactPage = await res.json();
  const parsedMarkdown = matter(contactData.content);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, contactData },
  };
};

type InputProps = {
  htmlString: string;
  contactData: ContactPage;
};

const Contact: FC<InputProps> = ({ htmlString, contactData }: InputProps) => {
  return (
    <>
      <Head>
        <title>{contactData.title}</title>
      </Head>
      <div className="markdown-custom py-5" dangerouslySetInnerHTML={{ __html: htmlString }} />
    </>
  );
};

// export const getStaticProps = async () => {
//   const markdown = fs.readFileSync(path.join("sections", "contact.md")).toString();
//   const parsedMarkdown = matter(markdown);
//   const htmlString = marked(parsedMarkdown.content);

//   return {
//     props: { htmlString, data: parsedMarkdown.data },
//   };
// };

export default Contact;
