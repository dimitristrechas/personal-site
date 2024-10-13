// app/components/ClientComponent.tsx
"use client";

import { Fragment, useEffect, useState } from "react";
import PostCard from "@/app/_components/PostCard";
import { normalizeText } from "@/utils/helpers";

type Props = {
  posts: Post[];
};

export default function ClientComponent({ posts }: Props) {
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
            <small className="">{`${postsList.length} ${
              postsList.length === 1 ? "post" : "posts"
            } found`}</small>
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
}
