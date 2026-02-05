import Image from "next/image";
import type { FC } from "react";
import { ghostClient } from "@/lib/ghost";
import type { GhostPost, Post } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";
import PostCard from "./_components/PostCard";

export const revalidate = 3600;

async function fetchData() {
  try {
    const response = await ghostClient.posts.browse({
      include: ["tags"],
      limit: 5,
      order: "published_at DESC",
    });

    const posts = ((response || []) as GhostPost[]).map((p) => mapGhostPostToPost(p));

    return {
      posts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      posts: [],
    };
  }
}

const Home: FC = async () => {
  const { posts } = await fetchData();

  return (
    <>
      <section id="welcome" className="mb-16 flex items-center">
        <Image
          className="rounded-full bg-red-200 object-cover p-px"
          src="/headshot-compressed.jpg"
          alt="a headshot of the author"
          width={128}
          height={128}
          style={{ width: "128px", height: "128px" }}
          priority
        />
        <div className="ml-4 lg:ml-6">
          <h1 className="mb-2 text-2xl">Welcome friend!</h1>
          <p>
            Read my blog if you are interested in JavaScript, React, or Frontend Development in general. <br />
            You can also learn more about me, the projects I work on, or contact me directly.
          </p>
        </div>
      </section>
      <section id="blog" className="mb-16">
        <h2 className="font-bold text-2xl">Latest Posts</h2>
        {posts.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Posts temporarily unavailable. Please try again later.</p>
        ) : (
          posts.map((post: Post, idx: number) => (
            <PostCard key={post.id} post={post} isLastPost={idx === posts.length - 1} />
          ))
        )}
      </section>
    </>
  );
};

export default Home;
