import fs from "fs";
import { GetStaticProps } from "next";
import Link from "next/link";
import path from "path";
import { FC, useEffect, useState } from "react";
import { getPostObjFromMarkdown, getTagColor, normalizeText } from "../utils/helpers";

const Blog: FC<PostProps> = ({ posts }: PostProps) => {
  const [postsList, setPostsList] = useState([] as Post[]);

  const handlePostSearch = (ev) => {
    const search = normalizeText(ev.target.value);

    if (search) {
      const filteredPosts = posts.filter((p) => {
        const postTitleNormalized = normalizeText(p.title);

        return postTitleNormalized.includes(search);
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
        <form>
          <div className="row pt-5 pb-4">
            <div className="col-12">
              <h2>My Blog</h2>
            </div>
            <div className="col-12 col-md-6">
              <input className="form-control mb-2" placeholder="Search posts..." onChange={handlePostSearch} />
              <small className="form-text text-muted pl-1">
                {`${postsList.length} ${postsList.length === 1 ? "post" : "posts"} found`}
              </small>
            </div>
          </div>
        </form>
      </section>
      <section>
        {postsList.map((post, key) => {
          return (
            <div className="row" key={post.slug}>
              <div className="col-12">
                <Link href="/blog/[slug]" as={"/blog/" + post.slug}>
                  <div className={key === postsList.length - 1 ? "py-3 post-card" : "border-bottom py-3 post-card"}>
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
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const files = fs.readdirSync("posts");

  const posts = files
    .map(function (fileName) {
      const markdown = fs.readFileSync(path.join("posts", fileName)).toString();
      const post = getPostObjFromMarkdown(fileName, markdown);

      return post;
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

export default Blog;
