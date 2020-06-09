import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
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
    <Row className="py-5">
      <Col className="d-flex flex-wrap">
        <Card className="profile-card mb-2 mr-5 p-2 d-none d-sm-none d-md-flex">
          <Card.Img
            className="profile-img"
            variant="top"
            src="/bomberman.jpg"
          />
          <Card.Body>
            <Card.Title>Greetings visitor!</Card.Title>
            <Card.Text className="h6 text-muted">
              Have a look around if you are interested in Javascript, React.js
              or front end development in general.
            </Card.Text>
          </Card.Body>
        </Card>
        <div className="popular-posts">
          <h2>Latest Posts</h2>
          {postsList.map((post, key) => {
            return (
              <Link
                key={post.slug}
                href="/blog/[slug]"
                as={"/blog/" + post.slug}
              >
                <div className="border-bottom py-3 post-card">
                  <div className="h4">{post.title}</div>
                  <div className="h6 text-muted">{post.date}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

export const getStaticProps = async () => {
  const files = fs.readdirSync("posts");

  // const posts = files.map((fileName) => {
  //   const markdown = fs.readFileSync(path.join("posts", fileName)).toString();
  //   const parsedMarkdown = matter(markdown);

  //   return {
  //     slug: fileName.replace(".md", ""),
  //     title: parsedMarkdown.data.title,
  //     desc: parsedMarkdown.data.description,
  //     date: parsedMarkdown.data.date,
  //   };
  // });

  // get the last 5 posts
  // https://stackoverflow.com/questions/30727864/how-to-read-a-file-from-directory-sorting-date-modified-in-node-js/40189439
  const posts = files
    .map(function (fileName) {
      const markdown = fs.readFileSync(path.join("posts", fileName)).toString();
      const parsedMarkdown = matter(markdown);

      return {
        slug: fileName.replace(".md", ""),
        title: parsedMarkdown.data.title,
        desc: parsedMarkdown.data.description,
        date: parsedMarkdown.data.date,
        time: fs.statSync(path.join("posts", fileName)).mtime.getTime(),
      };
    })
    .sort(function (a, b) {
      return a.time - b.time;
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
