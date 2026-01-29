import type { FC } from "react";
import { parseMarkdown } from "@/lib/markdown";

async function fetchAboutData() {
  const aboutResponse = await fetch(`${process.env.API_ENDPOINT}/about`);
  const aboutData = await aboutResponse.json();
  const aboutHtmlString = await parseMarkdown(aboutData.data);

  return {
    about: { aboutHtmlString, aboutData },
  };
}

const Page: FC = async () => {
  const { about } = await fetchAboutData();

  return (
    <section id="about" className="mb-16">
      <h1 className="font-bold text-2xl">{about.aboutData.data.title}</h1>
      <p className="prose dark:prose-invert pt-4" dangerouslySetInnerHTML={{ __html: about.aboutHtmlString }} />
    </section>
  );
};

export default Page;
