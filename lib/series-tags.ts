export const SERIES_TAG_PREFIX = "series-";
export const INTERNAL_SERIES_TAG_PREFIX = "hash-series-";

export function isSeriesTagSlug(tagSlug: string): boolean {
  return tagSlug.startsWith(SERIES_TAG_PREFIX) || tagSlug.startsWith(INTERNAL_SERIES_TAG_PREFIX);
}

/** Legacy public-tag check. Prefer {@link isSeriesTag} for membership. */
export function isPublicSeriesTag(tag: { slug: string; visibility: string }): boolean {
  return tag.visibility === "public" && tag.slug.startsWith(SERIES_TAG_PREFIX);
}

export function isInternalSeriesTag(tag: { slug: string; visibility: string }): boolean {
  return tag.visibility === "internal" && tag.slug.startsWith(INTERNAL_SERIES_TAG_PREFIX);
}

/** Membership check: any tag whose slug carries a series prefix (public legacy or internal standard). */
export function isSeriesTag(tag: { slug: string; visibility: string }): boolean {
  return isSeriesTagSlug(tag.slug);
}

export function seriesRouteSlugFromTagSlug(tagSlug: string): string {
  if (tagSlug.startsWith(INTERNAL_SERIES_TAG_PREFIX)) return tagSlug.slice(INTERNAL_SERIES_TAG_PREFIX.length);
  return tagSlug.slice(SERIES_TAG_PREFIX.length);
}

/** Candidate Content-API tag slugs for a `/series/{slug}` route (internal standard first, public legacy fallback). */
export function candidateSeriesTagSlugs(seriesSlug: string): string[] {
  return [`${INTERNAL_SERIES_TAG_PREFIX}${seriesSlug}`, `${SERIES_TAG_PREFIX}${seriesSlug}`];
}

/** Preferred (internal) tag slug for newly created series. */
export function seriesTagSlugFromRouteSlug(seriesSlug: string): string {
  return `${INTERNAL_SERIES_TAG_PREFIX}${seriesSlug}`;
}

/** Legacy public tag slug, for reading pre-migration series. */
export function legacySeriesTagSlugFromRouteSlug(seriesSlug: string): string {
  return `${SERIES_TAG_PREFIX}${seriesSlug}`;
}
