export const chunkTwoChars = (str: string): string => {
  const pairs: string[] = [];

  for (let i = 0; i < str.length; i += 2) {
    pairs.push(str.slice(i, i + 2));
  }

  return pairs.join(" ");
};
