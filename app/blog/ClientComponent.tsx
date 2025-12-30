"use client";

import { useMemo, useState } from "react";
import PostCard from "@/app/_components/PostCard";
import { normalizeText } from "@/utils/helpers";

type Props = {
  posts: Post[];
};

export default function ClientComponent({ posts }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const displayedPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const normalizedQuery = normalizeText(searchQuery);
    return posts.filter((p) =>
      normalizeText(p.title).includes(normalizedQuery),
    );
  }, [posts, searchQuery]);

  const resultsText = `#{displayedPosts.length} ${displayedPosts.length === 1 ? "post" : "posts"} found`;

  return (
    <>
      <search>
        <h1 className="mb-8 font-bold text-2xl text-gray-800">Blogposts</h1>
        <div className="flex flex-col">
          <label htmlFor="post-search" className="sr-only">
            Search posts
          </label>
          <input
            id="post-search"
            className="mb-1 max-w-sm rounded border-2 border-gray-300 p-1"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <small>{resultsText}</small>
        </div>
      </search>
      <section>
        {displayedPosts.map((post, idx) => (
          <PostCard
            key={post.id}
            post={post}
            isLastPost={idx === displayedPosts.length - 1}
          />
        ))}
      </section>
    </>
  );
}
