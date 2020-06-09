import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const Home = ({ posts }) => {
  const [postsList, setPostsList] = useState([]);

  const handlePostSearch = (ev) => {
    const search = ev.target.value;

    if (search) {
      const filteredPosts = posts.filter((p) => {
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
        <Form.Row className="py-5">
          <Col lg="4">
            <Form.Control
              className=""
              placeholder="Search posts..."
              onChange={handlePostSearch}
            />
            <Form.Text className="text-muted pl-1">
              {`${postsList.length} ${
                postsList.length == 1 ? "post" : "posts"
              } found`}
            </Form.Text>
          </Col>
        </Form.Row>
      </Form>
      {postsList.map((post, key) => {
        return (
          <Row key={post.slug}>
            <Col>
              <Link href="/blog/[slug]" as={"/blog/" + post.slug}>
                <div className="border-bottom py-3 post-card">
                  <div className="h4">{post.title}</div>
                  <div className="h6 text-muted">{post.date}</div>
                </div>
              </Link>
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
      date: parsedMarkdown.data.date,
    };
  });

  return {
    props: {
      posts,
    },
  };
};

export default Home;
