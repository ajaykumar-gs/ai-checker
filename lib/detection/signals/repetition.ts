import type { SignalResult } from "@/types";

// Repeated content words above expected natural frequency.
// Excludes function words (stopwords).
// AI tends to repeat key nouns and adjectives from the prompt excessively.
//
// raw = proportion of content-word types that appear ≥3× relative to vocabulary size
// normalized = clamp(raw / 0.3 * 100, 0, 100)

const STOP_WORDS = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "as", "you", "do", "at", "this", "but",
  "by", "from", "they", "we", "or", "an", "will", "all", "would", "there",
  "their", "what", "so", "up", "out", "if", "about", "which", "is", "are",
  "was", "were", "been", "being", "has", "had", "does", "did", "can", "could",
  "should", "may", "might", "shall", "more", "into", "than", "then", "its",
  "our", "your", "his", "her", "my", "me", "him", "us", "them", "also",
  "just", "very", "quite", "even", "too", "only", "any", "each", "both",
  "when", "where", "how", "who", "why", "some", "such", "no", "new", "one",
  "two", "first", "last", "long", "great", "little", "own", "right", "old",
  "good", "same", "most", "other", "after", "before", "through", "during",
]);

export function repetition(
  _text: string,
  _sentences: string[],
  tokens: string[]
): SignalResult {
  const contentTokens = tokens.filter((t) => !STOP_WORDS.has(t) && t.length > 3);
  if (contentTokens.length < 10) {
    return { raw: 0, normalized: 30, detail: "Too few content tokens for repetition analysis." };
  }

  const freq: Record<string, number> = {};
  for (const t of contentTokens) freq[t] = (freq[t] ?? 0) + 1;

  const vocabSize = Object.keys(freq).length;
  const overusedTypes = Object.values(freq).filter((c) => c >= 3).length;
  const raw = overusedTypes / Math.max(1, vocabSize);
  const normalized = Math.round(Math.min(100, (raw / 0.3) * 100));

  const topRepeated = Object.entries(freq)
    .filter(([, c]) => c >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([w, c]) => `"${w}" ×${c}`);

  return {
    raw: Math.round(raw * 1000) / 1000,
    normalized,
    detail: `${overusedTypes} of ${vocabSize} content-word types appear 3+ times. Top: ${topRepeated.join(", ") || "none"}. Over-repetition may indicate AI's tendency to echo prompt keywords.`,
  };
}
