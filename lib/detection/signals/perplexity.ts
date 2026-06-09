import type { SignalResult } from "@/types";

// APPROXIMATION, NOT TRUE PERPLEXITY.
// Proxy: high ratio of very common English words + low local repetition variation
// suggests fluent, predictable text typical of LLM output.
// This is NOT computed via a language model — it is a heuristic proxy only.
//
// raw = (commonWordRatio * 0.6) + (lowRepetitionScore * 0.4), range 0–1
// normalized = raw * 100 (higher = more AI-like)

const COMMON_WORDS = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "as", "you", "do", "at", "this", "but",
  "by", "from", "they", "we", "or", "an", "will", "all", "would", "there",
  "their", "what", "so", "up", "out", "if", "about", "which", "is", "are",
  "was", "were", "been", "being", "has", "had", "does", "did", "can", "could",
  "should", "may", "might", "shall", "also", "more", "into", "than", "then",
  "its", "our", "your", "his", "her", "my", "me", "him", "us", "them",
]);

export function perplexity(
  _text: string,
  sentences: string[],
  tokens: string[]
): SignalResult {
  if (tokens.length === 0) {
    return { raw: 0, normalized: 50, detail: "No tokens to analyze (approximation, not true perplexity)." };
  }

  const commonCount = tokens.filter((t) => COMMON_WORDS.has(t)).length;
  const commonWordRatio = commonCount / tokens.length;

  // Measure repetition uniformity: compute unigram counts, then entropy
  const freq: Record<string, number> = {};
  for (const t of tokens) freq[t] = (freq[t] ?? 0) + 1;
  const freqValues = Object.values(freq);
  const maxFreq = Math.max(...freqValues);
  // High max-freq relative to length → more repetitive → less "perplexing" → AI-like
  const repetitionScore = Math.min(1, maxFreq / (tokens.length * 0.15));

  // Sentence-length uniformity: low variance also suggests low perplexity proxy
  let sentenceUniformity = 0;
  if (sentences.length >= 2) {
    const lengths = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const stdDev = Math.sqrt(lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length);
    sentenceUniformity = Math.max(0, 1 - stdDev / 10);
  }

  const raw = commonWordRatio * 0.5 + repetitionScore * 0.3 + sentenceUniformity * 0.2;
  const normalized = Math.round(Math.min(100, Math.max(0, raw * 100)));

  return {
    raw: Math.round(raw * 1000) / 1000,
    normalized,
    detail:
      `Common-word ratio: ${(commonWordRatio * 100).toFixed(1)}%. ` +
      `Repetition proxy score: ${(repetitionScore * 100).toFixed(1)}%. ` +
      "NOTE: This is an approximation, not true language-model perplexity. " +
      "It reflects surface-level predictability only.",
  };
}
