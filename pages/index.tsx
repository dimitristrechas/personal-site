import { GetStaticProps } from "next";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/posts?_sort=published_at:DESC&_limit=3`);

  const posts: Post[] = await res.json();

  return {
    props: {
      posts,
    },
  };
};

type InputProps = { posts: Post[] };

const Home: FC<InputProps> = ({ posts }: InputProps) => {
  const [postsList, setPostsList] = useState([] as Post[]);

  useEffect(() => {
    if (posts.length) {
      setPostsList(posts);
    }
  }, [posts]);

  return (
    <>
      <section>
        <div className="row m-0 py-3">
          <div className="col-12 d-flex align-items-center justify-content-center rounded-3 py-3 px-3 profile-card">
            <img className="profile-img" src="/bomberman.png" alt="bomberman" />
            <div>
              <h4 className="card-title fs-4">Welcome friend!</h4>
              <p className="card-text text-muted">
                Read my blog if you are interested in JavaScript, React or Frontend Development in general. <br></br>
                You can also learn more about me, the projects I work on or contact me directly.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="row m-0 py-4">
          <div className="col-12 d-flex flex-wrap mb-5">
            <div className="popular-posts">
              <h2>Latest Posts</h2>
              {postsList.map((post, key) => {
                return (
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
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
