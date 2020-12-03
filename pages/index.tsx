import { GetServerSideProps } from "next";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { getTagColor } from "../utils/helpers";

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("https://dimitristrechas-strapi.herokuapp.com/posts?_sort=published_at:DESC&_limit=3");

  const posts: Post[] = await res.json();

  return {
    props: {
      posts,
    },
  };
};

const Home: FC<PostProps> = ({ posts }: PostProps) => {
  const [postsList, setPostsList] = useState([] as Post[]);

  useEffect(() => {
    if (posts.length) {
      setPostsList(posts);
    }
  }, [posts]);

  return (
    <>
      <section>
        <div className="row py-3">
          <div className="col-12 d-flex flex-wrap justify-content-center">
            <div className="card profile-card w-100 rounded">
              <img className="card-img-top profile-img" src="/bomberman.jpg" alt="bomberman" />
              <div className="card-body">
                <h4 className="card-title fs-5">Greetings!</h4>
                <p className="card-text text-muted">
                  Read my blog if you are interested in JavaScript, React or Frontend Development in general. <br></br>
                  You can also learn more about me, the projects I work on or contact me directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="row py-3">
          <div className="col-12 d-flex justify-content-center align-items-center pb-1">
            <FaRegLightbulb size="1.5rem" className="text-warning" />
            <span className="fs-4 ml-2">Refactored to TypeScript & Strapi backend!</span>
          </div>
        </div>
      </section>
      <section>
        <div className="row py-4">
          <div className="col-12 d-flex flex-wrap mb-5">
            <div className="popular-posts">
              <h2>Latest Posts</h2>
              {postsList.map((post, key) => {
                return (
                  <Link key={post._id} href="/blog/[id]" as={"/blog/" + post._id}>
                    <div className={key === postsList.length - 1 ? "py-3 post-card" : "border-bottom py-3 post-card"}>
                      <div className="h4">{post.title}</div>
                      <div className="h6 text-muted">{new Date(post.published_at).toLocaleString("en-US")}</div>
                      <div className="h6">
                        <button type="button" className={`btn btn-sm mr-1 btn-${getTagColor(post.tag)}`} disabled>
                          {post.tag}
                        </button>
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
