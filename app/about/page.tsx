import type { Metadata } from "next";
import { cache, type FC } from "react";
import { ghostClient } from "@/lib/ghost";
import { processGhostHtml } from "@/lib/html";
import { enhanceTimelineHtml } from "@/lib/timeline";
import type { GhostPage, Page } from "@/types/page";
import { mapGhostPageToPage } from "@/types/page";

export const revalidate = 3600;

const fetchAboutData = cache(async (): Promise<Page | null> => {
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
});

export async function generateMetadata(): Promise<Metadata> {
  const about = await fetchAboutData();
  return {
    title: about?.metaTitle || "About | Dimitris Trechas",
    description:
      about?.metaDescription ||
      "About Dimitris Trechas — Lead Frontend Engineer with 12 years of experience across e-commerce, online delivery, and telecommunications.",
  };
}

const AboutPage: FC = async () => {
  const about = await fetchAboutData();

  if (!about) {
    return (
      <section id="about" className="mb-16">
        <h1 className="text-2xl font-bold">About</h1>
        <p className="text-muted-foreground pt-4">Content temporarily unavailable. Please try again later.</p>
      </section>
    );
  }

  const processedHtml = enhanceTimelineHtml(await processGhostHtml(about.content));

  return (
    <section id="about" className="mb-16">
      <h1 className="text-2xl font-bold">{about.title}</h1>
      <div className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </section>
  );
};

export default AboutPage;
