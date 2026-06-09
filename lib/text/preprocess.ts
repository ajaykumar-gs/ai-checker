export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

export function hasCodeOrMarkup(text: string): boolean {
  return /```|<[a-z][^>]*>|^\s{4,}/m.test(text);
}

export function likelyNonEnglish(tokens: string[]): boolean {
  if (tokens.length < 20) return false;
  const englishCommon = new Set([
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
    "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
    "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
    "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  ]);
  const matched = tokens.slice(0, 100).filter((t) => englishCommon.has(t)).length;
  return matched < 3;
}
