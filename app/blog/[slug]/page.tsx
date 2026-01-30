import Link from "next/link";
import { parseMarkdown } from "@/lib/markdown";
import type { Post } from "@/types/post";

export const revalidate = 3600;

export async function generateStaticParams() {
  const response = await fetch(`${process.env.API_ENDPOINT}/posts?populate=%2A&sort[1]=createdAt%3Adesc`);
  const data = await response.json();
  const posts = (data.data || []) as Post[];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function getPostData(slug: string) {
  const res = await fetch(`${process.env.API_ENDPOINT}/posts/?filters[slug][$eq]=${slug}`);
  const data = await res.json();

  const post = data.data ? (data.data[0] as Post) : null;

  if (!post) {
    return { htmlString: "", post: null };
  }

  const htmlString = await parseMarkdown(post.content);

  return { htmlString, post };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { htmlString } = await getPostData(params.slug);

  return (
    <>
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlString }} />
      <div className="mt-6 mb-4 text-right">
        <Link href="/blog">back to blog list</Link>
      </div>
    </>
  );
}
