import { GetStaticProps } from "next";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { normalizeText } from "../../utils/helpers";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/posts?_sort=published_at:DESC`);

  const posts: Post[] = await res.json();

  return {
    props: {
      posts,
    },
  };
};

type InputProps = { posts: Post[] };

const Blog: FC<InputProps> = ({ posts }: InputProps) => {
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
            <div className="row" key={post._id}>
              <div className="col-12">
                <Link key={post._id} href="/blog/[slug]" as={"/blog/" + post.slug}>
                  <div className={key === postsList.length - 1 ? "py-3 post-card" : "border-bottom py-3 post-card"}>
                    <div className="h4">{post.title}</div>
                    <div className="h6 text-muted">{new Date(post.published_at).toLocaleString("en-US")}</div>
                    <div className="h6">
                      {post.tags?.length > 0
                        ? post.tags.map((tag) => {
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                className="btn btn-sm me-2 text-white"
                                style={{ backgroundColor: tag.color }}
                                disabled
                              >
                                {tag.title}
                              </button>
                            );
                          })
                        : null}
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

export default Blog;
