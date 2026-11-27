"use client";

import { useMemo, useState } from "react";
import PostCard from "@/app/_components/PostCard";
import type { Post } from "@/types/post";
import { createSearchMatcher, pluralize } from "@/utils/helpers";

type Props = {
  posts: Post[];
};

export default function BlogSearch({ posts }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const displayedPosts = useMemo(() => posts.filter(createSearchMatcher(searchQuery)), [posts, searchQuery]);

  return (
    <>
      <search>
        <h1 className="mb-8 text-2xl font-bold">Blogposts</h1>
        <div className="flex flex-col">
          <label htmlFor="post-search" className="sr-only">
            Search posts
          </label>
          <input
            id="post-search"
            type="search"
            className="border-border mb-1 max-w-sm rounded border-2 p-1"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <small>{`${pluralize(displayedPosts.length, "post")} found`}</small>
        </div>
      </search>
      <section>
        {displayedPosts.map((post, idx) => (
          <PostCard key={post.id} post={post} isLastPost={idx === displayedPosts.length - 1} />
        ))}
      </section>
    </>
  );
}
