const LEGACY_SERIES_TAG_PREFIX = "series-";
const INTERNAL_SERIES_TAG_PREFIX = "hash-series-";

export function isSeriesTagSlug(tagSlug: string): boolean {
  return tagSlug.startsWith(LEGACY_SERIES_TAG_PREFIX) || tagSlug.startsWith(INTERNAL_SERIES_TAG_PREFIX);
}

export function seriesRouteSlugFromTagSlug(tagSlug: string): string {
  if (tagSlug.startsWith(INTERNAL_SERIES_TAG_PREFIX)) return tagSlug.slice(INTERNAL_SERIES_TAG_PREFIX.length);
  return tagSlug.slice(LEGACY_SERIES_TAG_PREFIX.length);
}

/** Candidate Content-API tag slugs for a `/series/{slug}` route (internal standard first, public legacy fallback). */
export function candidateSeriesTagSlugs(seriesSlug: string): string[] {
  return [`${INTERNAL_SERIES_TAG_PREFIX}${seriesSlug}`, `${LEGACY_SERIES_TAG_PREFIX}${seriesSlug}`];
}
