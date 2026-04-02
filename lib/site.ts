const DEFAULT_SITE_URL = "https://dimitristrechas.com";

/** Canonical site origin (no trailing slash), for sitemaps, metadata, and absolute URLs. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}
