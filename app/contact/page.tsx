import matter from "gray-matter";
import { marked } from "marked";
import type { FC } from "react";

async function fetchContactData() {
  const contactResponse = await fetch(`${process.env.API_ENDPOINT}/contact`, { cache: "force-cache" });
  const contactData = await contactResponse.json();
  const contactParsedMarkdown = matter(contactData.data);
  const contactHtmlString = marked.parse(contactParsedMarkdown.content);

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
