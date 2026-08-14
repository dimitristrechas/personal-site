export const SERIES_TAG_PREFIX = "series-";

export function isSeriesTagSlug(tagSlug: string): boolean {
  return tagSlug.startsWith(SERIES_TAG_PREFIX);
}

export function seriesRouteSlugFromTagSlug(tagSlug: string): string {
  return tagSlug.slice(SERIES_TAG_PREFIX.length);
}

export function seriesTagSlugFromRouteSlug(seriesSlug: string): string {
  return `${SERIES_TAG_PREFIX}${seriesSlug}`;
}
