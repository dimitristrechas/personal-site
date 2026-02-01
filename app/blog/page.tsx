import type { Metadata } from "next";
import { ghostClient } from "@/lib/ghost";
import type { GhostPost, Post } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";
import ClientComponent from "./ClientComponent";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Dimitris Trechas - Blog",
};

async function getPosts(): Promise<Post[]> {
  try {
    const response = await ghostClient.posts.browse({
      include: ["tags"],
      limit: "all",
      order: "created_at DESC",
    });

    return ((response || []) as GhostPost[]).map((p) => mapGhostPostToPost(p));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function Page() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <section className="mb-16">
        <h1 className="mb-8 font-bold text-2xl">Blogposts</h1>
        <p className="text-muted-foreground">No posts available at the moment. Please try again later.</p>
      </section>
    );
  }

  return <ClientComponent posts={posts} />;
}
