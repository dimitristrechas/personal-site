import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC, Fragment, useEffect, useState } from "react";
import PostCard from "../../components/Post/PostCard";
import { normalizeText } from "../../utils/helpers";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/posts?sort[1]=updatedAt%3Adesc`);

  const posts: Post[] = await res.json().then((data) => data.data);

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
        const postTitleNormalized = normalizeText(p.attributes.title);

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
      <Head>
        <title>Dimitris Trechas - Blog</title>
      </Head>
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
        {postsList.map((post, idx) => {
          return (
            <Fragment key={post.id}>
              <PostCard post={post} isLastPost={idx === postsList.length - 1} />
            </Fragment>
          );
        })}
      </section>
    </>
  );
};

export default Blog;
