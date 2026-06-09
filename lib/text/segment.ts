const SENTENCE_SPLIT_RE = /(?<=[.!?])\s+(?=[A-Z])|(?<=[.!?])$/gm;

export function segmentSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const raw = trimmed
    .replace(/([.!?])\s+/g, "$1\n")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (raw.length === 0) {
    return [trimmed];
  }
  return raw;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}
