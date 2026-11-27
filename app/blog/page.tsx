import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/series";
import BlogSearch from "./BlogSearch";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Blog",
};

export default async function Page() {
  const posts = await getBlogPosts();

  if (posts.length === 0) {
    return (
      <section className="mb-16">
        <h1 className="mb-8 text-2xl font-bold">Blogposts</h1>
        <p className="text-muted-foreground">No posts available at the moment. Please try again later.</p>
      </section>
    );
  }

  return <BlogSearch posts={posts} />;
}
