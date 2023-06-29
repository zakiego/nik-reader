import { chunk } from "lodash";

export const chunkTwoChars = (str: string): string => {
  const split = chunk(str, 2)
    .map((v) => v.join(""))
    .join(" ");

  return split;
};
