// @ts-expect-error - No types available for @tryghost/content-api
import GhostContentAPI from "@tryghost/content-api";

if (!process.env.GHOST_URL) {
  throw new Error("GHOST_URL environment variable is required");
}

if (!process.env.GHOST_CONTENT_API_KEY) {
  throw new Error("GHOST_CONTENT_API_KEY environment variable is required");
}

export const ghostClient = new GhostContentAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: "v6.0",
});
