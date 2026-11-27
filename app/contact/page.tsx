import type { Metadata } from "next";
import type { FC } from "react";
import { processGhostHtml } from "@/lib/html";
import { getPage } from "@/lib/pages";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getPage("contact");
  return {
    title: contact?.metaTitle ? { absolute: contact.metaTitle } : "Contact",
    description: contact?.metaDescription || undefined,
  };
}

const ContactPage: FC = async () => {
  const contact = await getPage("contact");

  if (!contact) {
    return (
      <section id="contact" className="mb-16">
        <h1 className="text-2xl font-bold">Contact</h1>
        <p className="text-muted-foreground pt-4">Content temporarily unavailable. Please try again later.</p>
      </section>
    );
  }

  const processedHtml = processGhostHtml(contact.content);

  return (
    <section id="contact" className="mb-16">
      <h1 className="text-2xl font-bold">{contact.title}</h1>
      <div className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </section>
  );
};

export default ContactPage;
