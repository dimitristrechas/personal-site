import type { FC } from "react";
import { CV_PDF_DOWNLOAD_URL } from "@/lib/cv";
import { ghostClient } from "@/lib/ghost";
import { processGhostHtml } from "@/lib/html";
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
        <h1 className="text-2xl font-bold">About</h1>
        <p className="text-muted-foreground pt-4">Content temporarily unavailable. Please try again later.</p>
      </section>
    );
  }

  const processedHtml = await processGhostHtml(about.content);

  return (
    <section id="about" className="mb-16">
      <h1 className="text-2xl font-bold">{about.title}</h1>
      <div className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: processedHtml }} />
      <a
        href={CV_PDF_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground inline-block pt-4 hover:underline"
      >
        Download CV <span>↗</span>
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    </section>
  );
};

export default AboutPage;
