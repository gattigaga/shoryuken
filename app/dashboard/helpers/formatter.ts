export const getExcerpt = (words: string, maxChars = 20) => {
  const isExcerptNeeded = words.length > maxChars;

  if (isExcerptNeeded) {
    return words.slice(0, maxChars) + "...";
  }

  return words;
};
