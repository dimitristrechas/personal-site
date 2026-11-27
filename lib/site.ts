import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://dimitristrechas.com";

export const SITE_NAME = "Dimitris Trechas";

/** Canonical site origin (no trailing slash), for sitemaps, metadata, and absolute URLs. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

export function getSiteHostname(): string {
  return new URL(getSiteUrl()).hostname;
}

type ArticleMetadataInput = {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildArticleMetadata({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
}: ArticleMetadataInput): Metadata {
  const url = `${getSiteUrl()}${path}`;
  const trimmedDescription = description?.trim() || undefined;

  return {
    title,
    description: trimmedDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: trimmedDescription,
      type: "article",
      url,
      publishedTime,
      modifiedTime,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: trimmedDescription,
      ...(image ? { images: [image] } : {}),
    },
  };
}
