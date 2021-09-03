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

  const handlePostSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
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
        <form className="">
          <h2 className="mb-8 text-2xl font-bold text-gray-800">Blogposts</h2>
          <div className="flex flex-col">
            <input
              className="max-w-sm mb-1 border-2 rounded border-gray-300 p-1"
              placeholder="Search..."
              onChange={handlePostSearch}
            />
            <small className="">{`${postsList.length} ${postsList.length === 1 ? "post" : "posts"} found`}</small>
          </div>
        </form>
      </section>
      <section>
        {postsList.map((post, key) => {
          return (
            <div className="" key={post._id}>
              <Link key={post._id} href="/blog/[slug]" as={"/blog/" + post.slug}>
                <div className={`${key === postsList.length - 1 ? "" : "border-b-2"} py-4 cursor-pointer`}>
                  <div className="text-xl text-gray-800">{post.title}</div>
                  <div className="">{new Date(post.published_at).toLocaleString("en-US")}</div>
                  <div className="mt-2">
                    {post.tags?.length > 0
                      ? post.tags.map((tag) => {
                          console.log(`tag`, tag);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              className="py-1 px-2 mr-2 text-white rounded"
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
          );
        })}
      </section>
    </>
  );
};

export default Blog;
