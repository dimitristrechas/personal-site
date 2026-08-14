import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { processGhostHtml } from "@/lib/html";
import { getAllSeries, getSeriesBySlug, getSeriesHubPost } from "@/lib/series";
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
  const series = await getSeriesBySlug(params.slug);

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
  const hubPost = await getSeriesHubPost(params.slug);

  if (!hubPost) {
    notFound();
  }

  const htmlString = await processGhostHtml(hubPost.content);

  return (
    <>
      {hubPost.featuredImage ? (
        <div className="mb-6 max-h-50 overflow-hidden rounded-lg sm:max-h-80">
          <Image
            src={hubPost.featuredImage}
            alt={hubPost.title}
            width={1600}
            height={900}
            className="h-full w-full object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 960px"
            priority
          />
        </div>
      ) : null}
      <h1 className="mb-2 font-bold text-3xl">{hubPost.title}</h1>
      <div className="mb-6 text-muted-foreground text-sm">{dateFormatter.format(new Date(hubPost.publishedAt))}</div>
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlString }} />
      <div className="mt-6 mb-4 text-right">
        <Link href="/">back to home</Link>
      </div>
    </>
  );
}
