import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverImage from "@/app/_components/CoverImage";
import { processGhostHtml } from "@/lib/html";
import { getAllSeries, getSeriesPageData } from "@/lib/series";
import { buildArticleMetadata } from "@/lib/site";
import { formatDate, pluralize } from "@/utils/helpers";

export const revalidate = 600;

export async function generateStaticParams() {
  const seriesList = await getAllSeries();
  return seriesList.map((series) => ({ slug: series.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { series } = await getSeriesPageData(params.slug);

  if (!series) {
    return { title: "Article series" };
  }

  return buildArticleMetadata({
    title: `${series.title} (series)`,
    description: series.description,
    path: `/series/${series.slug}`,
    image: series.coverImage,
  });
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { series, hubPost, members } = await getSeriesPageData(params.slug);

  if (!series || !hubPost) {
    notFound();
  }

  const htmlString = processGhostHtml(hubPost.content);

  return (
    <>
      {series.coverImage && <CoverImage src={series.coverImage} alt={series.title} />}
      <h1 className="mb-2 text-3xl font-bold">{series.title}</h1>
      <div className="text-muted-foreground mb-6 text-sm">{pluralize(members.length, "article")}</div>
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlString }} />
      <section className="mt-10">
        <h2 className="mb-2 text-xl font-semibold">In this series</h2>
        {members.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Member articles will appear here once they are tagged with this series in Ghost.
          </p>
        ) : (
          <ol>
            {members.map((member, idx) => (
              <li key={member.id} className={idx === members.length - 1 ? "" : "border-border border-b"}>
                <Link
                  href={`/blog/${member.slug}`}
                  prefetch={true}
                  className="group group-hover:bg-muted group-focus-visible:bg-muted flex items-baseline gap-4 rounded py-4 transition-colors"
                  aria-label={`Read ${member.title} in the ${series.title} series`}
                >
                  <span className="text-muted-foreground w-6 shrink-0 text-sm tabular-nums">{idx + 1}</span>
                  <span>
                    <span className="block font-medium group-hover:underline">{member.title}</span>
                    <span className="text-muted-foreground text-sm">{formatDate(member.publishedAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
      <div className="mt-6 mb-4 text-right">
        <Link href="/">back to home</Link>
      </div>
    </>
  );
}
