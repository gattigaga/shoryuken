import { v4 as uuid } from "uuid";

export const getExcerpt = (words: string, maxChars = 20) => {
  const isExcerptNeeded = words.length > maxChars;

  if (isExcerptNeeded) {
    return words.slice(0, maxChars) + "...";
  }

  return words;
};

export const getSlug = (words: string) => {
  const uniqueCode = uuid().split("-")[0];

  return (
    words.toLowerCase().split(" ").slice(0, 5).join("-") + `-${uniqueCode}`
  );
};
