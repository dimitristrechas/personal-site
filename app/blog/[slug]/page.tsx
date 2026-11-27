import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import CoverImage from "@/app/_components/CoverImage";
import { processGhostHtml } from "@/lib/html";
import { getAllPosts, getPost } from "@/lib/posts";
import { getSeriesHubPost, getSeriesTagFromPost } from "@/lib/series";
import { seriesRouteSlugFromTagSlug } from "@/lib/series-tags";
import { buildArticleMetadata } from "@/lib/site";
import { formatDate } from "@/utils/helpers";

export const revalidate = 600;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    return { title: "Blog post" };
  }

  return buildArticleMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.featuredImage,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Only the hub/intro post redirects to its series page; members stay readable as normal posts.
  const seriesTag = getSeriesTagFromPost(post);
  if (seriesTag) {
    const seriesSlug = seriesRouteSlugFromTagSlug(seriesTag.slug);
    const hubPost = await getSeriesHubPost(seriesSlug);
    if (hubPost?.slug === post.slug) {
      permanentRedirect(`/series/${seriesSlug}`);
    }
  }

  const htmlString = processGhostHtml(post.content);

  return (
    <>
      {post.featuredImage && <CoverImage src={post.featuredImage} alt={post.title} />}
      <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
      <div className="text-muted-foreground mb-6 text-sm">{formatDate(post.publishedAt)}</div>
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlString }} />
      <div className="mt-6 mb-4 text-right">
        <Link href="/blog">back to blog list</Link>
      </div>
    </>
  );
}
