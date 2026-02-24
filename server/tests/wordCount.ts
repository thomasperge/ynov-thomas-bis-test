export function countOccurrences(text: string, word: string): number {
  if (!word) return 0;
  const regex = new RegExp(word, "gi");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}
