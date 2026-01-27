import type { FC } from "react";
import { parseMarkdown } from "@/lib/markdown";

async function fetchContactData() {
  const contactResponse = await fetch(`${process.env.API_ENDPOINT}/contact`, { cache: "force-cache" });
  const contactData = await contactResponse.json();
  const contactHtmlString = await parseMarkdown(contactData.data);

  return {
    contact: { contactHtmlString, contactData },
  };
}

const Contact: FC = async () => {
  const { contact } = await fetchContactData();

  return (
    <section id="contact" className="mb-16">
      <h1 className="font-bold text-2xl text-foreground">{contact.contactData.data.title}</h1>
      <p className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: contact.contactHtmlString }} />
    </section>
  );
};

export default Contact;
