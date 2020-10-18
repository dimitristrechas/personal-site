import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
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
      <section>
        <Row className="py-5">
          <Col xs={12} className="d-flex flex-wrap justify-content-center">
            <Card className="profile-card w-100">
              <Card.Img
                className="profile-img"
                variant="top"
                src="/bomberman.jpg"
                alt="bomberman"
              />
              <Card.Body>
                <Card.Title>Greetings friend!</Card.Title>
                <Card.Text className="h6 text-muted">
                  Read my blog if you are interested in JavaScript, React or
                  Frontend Development in general.
                </Card.Text>
                <Card.Text className="h6 text-muted">
                  You can also learn more about me or contact me directly.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      <section>
        <Row className="py-5">
          <Col xs={12} className="d-flex flex-wrap mb-5">
            <div className="popular-posts">
              <h2>Latest Posts</h2>
              {postsList.map((post, key) => {
                return (
                  <Link
                    key={post.slug}
                    href="/blog/[slug]"
                    as={"/blog/" + post.slug}
                  >
                    <div
                      className={
                        key === postsList.length - 1
                          ? "py-3 post-card"
                          : "border-bottom py-3 post-card"
                      }
                    >
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
                );
              })}
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export const getStaticProps = async () => {
  const files = fs.readdirSync("posts");

  // get the last 3 posts
  // https://stackoverflow.com/questions/30727864/how-to-read-a-file-from-directory-sorting-date-modified-in-node-js/40189439
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
    .slice(Math.max(files.length - 3, 0))
    .reverse();

  return {
    props: {
      posts,
    },
  };
};

export default Home;
