import type { SignalResult } from "@/types";

// Variance (not std dev) of sentence lengths.
// Distinct framing from burstiness: this captures the spread/distribution shape.
// Low variance → uniform, mechanical output → AI-like → HIGH score.
//
// raw = variance of per-sentence word counts
// normalized: inverted, clamped; variance ≥ 150 → 0, variance = 0 → 100

export function sentenceVariance(
  _text: string,
  sentences: string[],
  _tokens: string[]
): SignalResult {
  if (sentences.length < 2) {
    return { raw: 0, normalized: 60, detail: "Single sentence — variance suppressed; defaulting to moderately AI-like." };
  }

  const lengths = sentences.map((s) => s.trim().split(/\s+/).filter(Boolean).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length;

  // Invert: high variance → more human → lower AI score
  // normalized = 100 - clamp(variance / 150 * 100, 0, 100)
  const normalized = Math.round(Math.max(0, Math.min(100, 100 - (variance / 150) * 100)));

  return {
    raw: Math.round(variance * 100) / 100,
    normalized,
    detail: `Sentence length variance: ${variance.toFixed(2)} (mean: ${mean.toFixed(1)} words). Lower variance indicates uniform rhythm typical of AI output.`,
  };
}
