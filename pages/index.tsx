import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";
import { getTagColor } from "../utils/helpers";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

type Post = {
  slug: string;
  title: any;
  date: string;
  timestamp: number;
  tags: any;
};

type HomeProps = { posts: Post[] };

const Home = ({ posts }: HomeProps) => {
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    if (posts.length) {
      setPostsList(posts);
    }
  }, [posts]);

  return (
    <>
      <section>
        <div className="row py-5">
          <div className="col-12 d-flex flex-wrap justify-content-center">
            <div className="card profile-card w-100">
              <img
                className="card-img-top profile-img"
                src="/bomberman.jpg"
                alt="bomberman"
              />
              <div className="card-body">
                <h4 className="card-title">Greetings friend!</h4>
                <p className="card-text text-muted">
                  Read my blog if you are interested in JavaScript, React or
                  Frontend Development in general. <br></br>You can also learn
                  more about me or contact me directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="row py-5">
          <div className="col-12 d-flex flex-wrap mb-5">
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
                            <button
                              type="button"
                              key={tag}
                              className={`btn btn-sm mr-1 btn-${getTagColor(
                                tag
                              )}`}
                              disabled
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const files = fs.readdirSync("posts");

  // get the last 3 posts
  // https://stackoverflow.com/questions/30727864/how-to-read-a-file-from-directory-sorting-date-modified-in-node-js/40189439
  const posts: Post[] = files
    .map(function (fileName) {
      const markdown = fs.readFileSync(path.join("posts", fileName)).toString();
      const parsedMarkdown = matter(markdown);

      // month is 0-based, that's why we need dataParts[1] - 1
      let fileDate = parsedMarkdown.data.date.split("/");
      let dateObject = new Date(+fileDate[2], fileDate[1] - 1, +fileDate[0]);
      let tags = parsedMarkdown.data.tags
        .split(",")
        .map((tag: string) => tag.trim());

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
