import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";

async function getPostData(slug: string) {
  const res = await fetch(
    `${process.env.API_ENDPOINT}/posts/?filters[slug][$eq]=${slug}`,
  );
  const data = await res.json();

  const post = data.data ? data.data[0] : null;

  if (!post) {
    return { htmlString: "", post: null };
  }

  const parsedMarkdown = matter(post.content);
  const htmlString = marked(parsedMarkdown.content);

  return { htmlString, post };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { htmlString } = await getPostData(params.slug);

  return (
    <>
      <article
        className="prose py-5"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
      <div className="text-right py-1">
        <Link href="/blog">back to blog list</Link>
      </div>
    </>
  );
}
