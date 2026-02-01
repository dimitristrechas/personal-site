import type { FC } from "react";
import { ghostClient } from "@/lib/ghost";
import { processGhostHtml } from "@/lib/markdown";
import type { GhostPage, Page } from "@/types/page";
import { mapGhostPageToPage } from "@/types/page";

export const dynamic = "force-static";

async function fetchContactData(): Promise<Page | null> {
  try {
    const response = await ghostClient.pages.read({ slug: "contact" });
    if (!response) {
      return null;
    }
    return mapGhostPageToPage(response as GhostPage);
  } catch (error) {
    console.error("Error fetching contact page:", error);
    return null;
  }
}

const ContactPage: FC = async () => {
  const contact = await fetchContactData();

  if (!contact) {
    return (
      <section id="contact" className="mb-16">
        <h1 className="font-bold text-2xl">Contact</h1>
        <p className="pt-4 text-muted-foreground">Content temporarily unavailable. Please try again later.</p>
      </section>
    );
  }

  const processedHtml = await processGhostHtml(contact.content);

  return (
    <section id="contact" className="mb-16">
      <h1 className="font-bold text-2xl">{contact.title}</h1>
      <div className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </section>
  );
};

export default ContactPage;
