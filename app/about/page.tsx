import matter from "gray-matter";
import { marked } from "marked";
import type { FC } from "react";

async function fetchAboutData() {
  const aboutResponse = await fetch(`${process.env.API_ENDPOINT}/about`);
  const aboutData = await aboutResponse.json();
  const aboutParsedMarkdown = matter(aboutData.data);
  const aboutHtmlString = marked.parse(aboutParsedMarkdown.content);

  return {
    about: { aboutHtmlString, aboutData },
  };
}

const Page: FC = async () => {
  const { about } = await fetchAboutData();

  return (
    <section id="about" className="mb-16">
      <h1 className="font-bold text-2xl text-foreground">{about.aboutData.data.title}</h1>
      <p className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: about.aboutHtmlString }} />
    </section>
  );
};

export default Page;
