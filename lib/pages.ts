import { cache } from "react";
import { ghostClient } from "@/lib/ghost";
import type { GhostPage, Page } from "@/types/page";
import { mapGhostPageToPage } from "@/types/page";

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  try {
    const response = await ghostClient.pages.read({ slug });
    return response ? mapGhostPageToPage(response as GhostPage) : null;
  } catch (error) {
    console.error(`Error fetching page "${slug}":`, error);
    return null;
  }
});
