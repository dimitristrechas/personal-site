import { FC } from "react";
import matter from "gray-matter";
import { marked } from "marked";

async function fetchContactData() {
  const contactResponse = await fetch(`${process.env.API_ENDPOINT}/contact`);
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
      <h1 className="text-2xl font-bold text-gray-800">
        {contact.contactData.data.title}
      </h1>
      <p
        className="prose pt-4"
        dangerouslySetInnerHTML={{ __html: contact.contactHtmlString }}
      />
    </section>
  );
};

export default Contact;
