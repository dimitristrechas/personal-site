import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import marked from "marked";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import hljs from "highlight.js";

marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlight(lang, code).value;
  },
});

const Bio = ({ htmlString, data }) => {
  return (
    <>
      <Head>
        <title>{data.title}</title>
      </Head>
      <Row>
        <Col>
          <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        </Col>
      </Row>
    </>
  );
};

export const getStaticProps = async () => {
  const markdown = fs.readFileSync(path.join("sections", "bio.md")).toString();
  const parsedMarkdown = matter(markdown);
  const htmlString = marked(parsedMarkdown.content);

  return {
    props: { htmlString, data: parsedMarkdown.data },
  };
};

export default Bio;
