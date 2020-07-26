import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { getTagColor } from "../utils/helpers";

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
        <Form.Row className="pt-5 pb-4">
          <Col sm={12}>
            <h2>My Blog</h2>
          </Col>
          <Col sm={12} md={6}>
            <Form.Control
              className=""
              placeholder="Search posts..."
              onChange={handlePostSearch}
            />
            <Form.Text className="text-muted pl-1">
              {`${postsList.length} ${
                postsList.length === 1 ? "post" : "posts"
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
                  <div className="h6">
                    {post.tags.map((tag) => {
                      return (
                        <Button
                          type="button"
                          key={tag}
                          variant={getTagColor(tag)}
                          size="sm"
                          className="mr-1"
                          disabled
                        >
                          {tag}
                        </Button>
                      );
                    })}
                  </div>
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

  const posts = files
    .map(function (fileName) {
      const markdown = fs.readFileSync(path.join("posts", fileName)).toString();
      const parsedMarkdown = matter(markdown);

      // month is 0-based, that's why we need dataParts[1] - 1
      let fileDate = parsedMarkdown.data.date.split("/");
      let dateObject = new Date(+fileDate[2], fileDate[1] - 1, +fileDate[0]);

      let tags = parsedMarkdown.data.tags.split(",").map((tag) => tag.trim());

      return {
        slug: fileName.replace(".md", ""),
        title: parsedMarkdown.data.title,
        date: dateObject.toDateString(),
        timestamp: dateObject.getTime(),
        tags: tags,
      };
    })
    .sort(function (a, b) {
      return a.timestamp - b.timestamp;
    })
    .reverse();

  return {
    props: {
      posts,
    },
  };
};

export default Home;
