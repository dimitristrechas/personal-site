import { TAG_REACT, TAG_JAVASCRIPT, TAG_OTHER } from "./constants";

export const getTagColor = (tag) => {
  switch (tag) {
    case TAG_REACT:
      return "primary";
    case TAG_JAVASCRIPT:
      return "success";
    case TAG_OTHER:
      return "dark";
    default:
      return "secondary";
  }
};
