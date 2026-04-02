import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ghostClient } from "@/lib/ghost";
import { processGhostHtml } from "@/lib/html";
import { getSiteUrl } from "@/lib/site";
import type { GhostPost, Post } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

let postsCache: Map<string, GhostPost> | null = null;

export async function generateStaticParams() {
  const response = await ghostClient.posts.browse({
    limit: "all",
    include: ["tags"],
  });
  const posts = (response || []) as GhostPost[];

  postsCache = new Map(posts.map((p) => [p.slug, p]));

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function resolvePost(slug: string): Promise<Post | null> {
  try {
    let ghostPost = postsCache?.get(slug);

    if (!ghostPost) {
      const response = await ghostClient.posts.read({ slug }, { include: ["tags"] });
      if (!response) {
        return null;
      }
      ghostPost = response as GhostPost;
    }

    return mapGhostPostToPost(ghostPost);
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = await resolvePost(params.slug);

  if (!post) {
    return { title: "Blog post" };
  }

  const canonicalUrl = `${getSiteUrl()}/blog/${post.slug}`;
  const description = post.description.trim() || undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      ...(post.featuredImage ? { images: [{ url: post.featuredImage }] } : {}),
    },
    twitter: {
      card: post.featuredImage ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(post.featuredImage ? { images: [post.featuredImage] } : {}),
    },
  };
}

async function getPostData(slug: string): Promise<{ htmlString: string; post: Post | null }> {
  const post = await resolvePost(slug);
  if (!post) {
    return { htmlString: "", post: null };
  }
  const processedHtml = await processGhostHtml(post.content);
  return { htmlString: processedHtml, post };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { htmlString, post } = await getPostData(params.slug);

  return (
    <>
      {post?.featuredImage && (
        <div className="mb-6 max-h-50 overflow-hidden rounded-lg sm:max-h-80">
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={1600}
            height={900}
            className="h-full w-full object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 960px"
            priority
          />
        </div>
      )}
      {post && (
        <>
          <h1 className="mb-2 font-bold text-3xl">{post.title}</h1>
          <div className="mb-6 text-muted-foreground text-sm">{dateFormatter.format(new Date(post.publishedAt))}</div>
        </>
      )}
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlString }} />
      <div className="mt-6 mb-4 text-right">
        <Link href="/blog">back to blog list</Link>
      </div>
    </>
  );
}
