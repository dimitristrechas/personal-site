import matter from "gray-matter";
import { TAG_REACT, TAG_JAVASCRIPT, TAG_OTHER, TAG_CSS } from "./constants";

export const getTagColor = (tag: string): string => {
  switch (tag) {
    case TAG_REACT:
      return "primary";
    case TAG_JAVASCRIPT:
      return "success";
    case TAG_CSS:
      return "info";
    case TAG_OTHER:
      return "dark";
    default:
      return "secondary";
  }
};

export const normalizeText = (input: string): string => {
  // normalize and uppercase search value
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
};

export const getPostObjFromMarkdown = (fileName: string, markdown: string): Post => {
  const parsedMarkdown = matter(markdown);

  // month is 0-based, that's why we need dataParts[1] - 1
  const fileDate = parsedMarkdown.data.date.split("/");
  const dateObject = new Date(+fileDate[2], fileDate[1] - 1, +fileDate[0]);

  const tags = parsedMarkdown.data.tags.split(",").map((tag: string) => tag.trim());

  return {
    slug: fileName.replace(".md", ""),
    title: parsedMarkdown.data.title,
    date: dateObject.toDateString(),
    timestamp: dateObject.getTime(),
    tags: tags,
  };
};
