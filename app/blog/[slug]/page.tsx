import Image from "next/image";
import Link from "next/link";
import { ghostClient } from "@/lib/ghost";
import { processGhostHtml } from "@/lib/markdown";
import type { GhostPost, Post } from "@/types/post";
import { mapGhostPostToPost } from "@/types/post";

export const revalidate = 3600;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
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

async function getPostData(slug: string): Promise<{ htmlString: string; post: Post | null }> {
  try {
    let ghostPost = postsCache?.get(slug);

    if (!ghostPost) {
      const response = await ghostClient.posts.read({ slug }, { include: ["tags"] });
      if (!response) {
        return { htmlString: "", post: null };
      }
      ghostPost = response as GhostPost;
    }

    const post = mapGhostPostToPost(ghostPost);
    const processedHtml = await processGhostHtml(post.content);
    return { htmlString: processedHtml, post };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { htmlString: "", post: null };
  }
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { htmlString, post } = await getPostData(params.slug);

  return (
    <>
      {post?.featuredImage && (
        <div className="mb-6 max-h-[200px] overflow-hidden rounded-lg sm:max-h-[320px]">
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
