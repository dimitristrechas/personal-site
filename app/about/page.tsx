import type { Metadata } from "next";
import type { FC } from "react";
import { processGhostHtml } from "@/lib/html";
import { getPage } from "@/lib/pages";
import { enhanceTimelineHtml } from "@/lib/timeline";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getPage("about");
  return {
    title: about?.metaTitle ? { absolute: about.metaTitle } : "About",
    description:
      about?.metaDescription ||
      "About Dimitris Trechas — Lead Frontend Engineer with 12 years of experience across e-commerce, online delivery, and telecommunications.",
  };
}

const AboutPage: FC = async () => {
  const about = await getPage("about");

  if (!about) {
    return (
      <section id="about" className="mb-16">
        <h1 className="text-2xl font-bold">About</h1>
        <p className="text-muted-foreground pt-4">Content temporarily unavailable. Please try again later.</p>
      </section>
    );
  }

  const processedHtml = enhanceTimelineHtml(processGhostHtml(about.content));

  return (
    <section id="about" className="mb-16">
      <h1 className="text-2xl font-bold">{about.title}</h1>
      <div className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </section>
  );
};

export default AboutPage;
