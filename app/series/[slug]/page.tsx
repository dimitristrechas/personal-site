import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { processGhostHtml } from "@/lib/html";
import { getAllSeries, getSeriesPageData } from "@/lib/series";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 600;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export async function generateStaticParams() {
  const seriesList = await getAllSeries();

  return seriesList.map((series) => ({
    slug: series.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { series } = await getSeriesPageData(params.slug);

  if (!series) {
    return { title: "Article series" };
  }

  const canonicalUrl = `${getSiteUrl()}/series/${series.slug}`;
  const description = series.description?.trim() || undefined;

  return {
    title: `${series.title} - Article series`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: series.title,
      description,
      type: "article",
      url: canonicalUrl,
      ...(series.coverImage ? { images: [{ url: series.coverImage }] } : {}),
    },
    twitter: {
      card: series.coverImage ? "summary_large_image" : "summary",
      title: series.title,
      description,
      ...(series.coverImage ? { images: [series.coverImage] } : {}),
    },
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { series, hubPost, members } = await getSeriesPageData(params.slug);

  if (!series || !hubPost) {
    notFound();
  }

  const htmlString = await processGhostHtml(hubPost.content);
  const articleLabel = members.length === 1 ? "1 article" : `${members.length} articles`;

  return (
    <>
      {series.coverImage || hubPost.featuredImage ? (
        <div className="mb-6 max-h-50 overflow-hidden rounded-lg sm:max-h-80">
          <Image
            src={series.coverImage ?? hubPost.featuredImage ?? ""}
            alt={series.title}
            width={1600}
            height={900}
            className="h-full w-full object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 960px"
            priority
          />
        </div>
      ) : null}
      <h1 className="mb-2 text-3xl font-bold">{series.title}</h1>
      <div className="text-muted-foreground mb-6 text-sm">{articleLabel}</div>
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
                    <span className="text-muted-foreground text-sm">
                      {dateFormatter.format(new Date(member.publishedAt))}
                    </span>
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
