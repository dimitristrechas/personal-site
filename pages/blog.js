import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";

const Home = ({ posts }) => {
  const [postsList, setPostsList] = useState([]);

  const handlePostSearch = (ev) => {
    const search = ev.target.value;

    if (search) {
      const filteredPosts = postsList.filter((p) => {
        return p.title.includes(search);
      });

      setPostsList(filteredPosts);
    } else {
      setPostsList(posts);
    }
  };

  useEffect(() => {
    if (posts.length) {
      setPostsList(posts);
    }
  }, [posts]);

  return (
    <>
      <Form>
        <Form.Row className="py-3">
          <Col lg="6">
            <Form.Control
              placeholder="Search posts..."
              onChange={handlePostSearch}
            />
          </Col>
        </Form.Row>
      </Form>
      {postsList.map((post) => {
        return (
          <Row key={post.slug} className="py-3">
            <Col>
              <Link href="/blog/[slug]" as={"/blog/" + post.slug}>
                <a className="h4 text-black">{post.title}</a>
              </Link>
              <div className="h6">{post.desc}</div>
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export const getStaticProps = async () => {
  const files = fs.readdirSync("posts");

  const posts = files.map((filename) => {
    const markdown = fs.readFileSync(path.join("posts", filename)).toString();
    const parsedMarkdown = matter(markdown);

    return {
      slug: filename.replace(".md", ""),
      title: parsedMarkdown.data.title,
      desc: parsedMarkdown.data.description,
    };
  });

  return {
    props: {
      posts,
    },
  };
};

export default Home;
