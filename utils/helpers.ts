import { TAG_CSS, TAG_JAVASCRIPT, TAG_OTHER, TAG_REACT } from "./constants";

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
