import { v4 as uuid } from "uuid";

export const getSlug = (words: string) => {
  const uniqueCode = uuid().split("-")[0];

  return (
    words.toLowerCase().split(" ").slice(0, 5).join("-") + `-${uniqueCode}`
  );
};
