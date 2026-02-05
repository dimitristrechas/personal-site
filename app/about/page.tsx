import type { FC } from "react";
import { ghostClient } from "@/lib/ghost";
import { processGhostHtml } from "@/lib/markdown";
import type { GhostPage, Page } from "@/types/page";
import { mapGhostPageToPage } from "@/types/page";

export const revalidate = 3600;

async function fetchAboutData(): Promise<Page | null> {
  try {
    const response = await ghostClient.pages.read({ slug: "about" });
    if (!response) {
      return null;
    }
    return mapGhostPageToPage(response as GhostPage);
  } catch (error) {
    console.error("Error fetching about page:", error);
    return null;
  }
}

const AboutPage: FC = async () => {
  const about = await fetchAboutData();

  if (!about) {
    return (
      <section id="about" className="mb-16">
        <h1 className="font-bold text-2xl">About</h1>
        <p className="pt-4 text-muted-foreground">Content temporarily unavailable. Please try again later.</p>
      </section>
    );
  }

  const processedHtml = await processGhostHtml(about.content);

  return (
    <section id="about" className="mb-16">
      <h1 className="font-bold text-2xl">{about.title}</h1>
      <div className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </section>
  );
};

export default AboutPage;
