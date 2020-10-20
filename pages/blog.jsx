import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";
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
      <form>
        <div className="row pt-5 pb-4">
          <div className="col-12">
            <h2>My Blog</h2>
          </div>
          <div className="col-12 col-md-6">
            <input
              className="form-control mb-2"
              placeholder="Search posts..."
              onChange={handlePostSearch}
            />
            <small className="form-text text-muted pl-1">
              {`${postsList.length} ${
                postsList.length === 1 ? "post" : "posts"
              } found`}
            </small>
          </div>
        </div>
      </form>
      {postsList.map((post, key) => {
        return (
          <div className="row" key={post.slug}>
            <div className="col-12">
              <Link href="/blog/[slug]" as={"/blog/" + post.slug}>
                <div className="border-bottom py-3 post-card">
                  <div className="h4">{post.title}</div>
                  <div className="h6 text-muted">{post.date}</div>
                  <div className="h6">
                    {post.tags.map((tag) => {
                      return (
                        <button
                          type="button"
                          key={tag}
                          className={`btn btn-sm mr-1 btn-${getTagColor(tag)}`}
                          disabled
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Link>
            </div>
          </div>
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
