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
