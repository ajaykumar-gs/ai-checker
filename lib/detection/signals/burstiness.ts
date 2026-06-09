import type { SignalResult } from "@/types";

// Measures std dev of sentence lengths.
// High burstiness (varied lengths) → human-like → LOW AI score.
// Low burstiness (uniform lengths) → AI-like → HIGH AI score.
// raw = std dev of token counts per sentence
// normalized: raw 0 → 100, raw ≥ 15 → 0 (clamped, inverted)
export function burstiness(
  _text: string,
  sentences: string[],
  _tokens: string[]
): SignalResult {
  if (sentences.length < 2) {
    return { raw: 0, normalized: 70, detail: "Only one sentence — cannot compute burstiness; defaulting to moderately AI-like." };
  }

  const lengths = sentences.map((s) => s.trim().split(/\s+/).filter(Boolean).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  // High std dev → more human → lower AI score
  // Invert: normalized = 100 - clamp(stdDev / 15 * 100, 0, 100)
  const normalized = Math.round(Math.max(0, Math.min(100, 100 - (stdDev / 15) * 100)));

  return {
    raw: Math.round(stdDev * 100) / 100,
    normalized,
    detail: `Sentence length std dev: ${stdDev.toFixed(2)} words (mean: ${mean.toFixed(1)} words). Lower variation suggests AI uniformity.`,
  };
}
