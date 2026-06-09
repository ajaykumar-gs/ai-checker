import type { SignalResult } from "@/types";

// Token-distribution entropy proxy.
// True high entropy (uniform distribution) or suspiciously smooth distribution
// can indicate AI output. We measure deviation from expected natural entropy.
// Human text typically has moderate entropy; AI text can be either very smooth or slightly low.
//
// raw = Shannon entropy of unigram distribution (nats, converted to bits)
// normalized: entropy outside natural range [3.5, 5.5 bits] pushed toward AI score
// Heuristic: very high entropy (>5.5) OR very low entropy (<3.0) → elevated AI score

function shannonEntropy(tokens: string[]): number {
  const freq: Record<string, number> = {};
  for (const t of tokens) freq[t] = (freq[t] ?? 0) + 1;
  const n = tokens.length;
  return -Object.values(freq).reduce((sum, count) => {
    const p = count / n;
    return sum + p * Math.log2(p);
  }, 0);
}

export function entropy(
  _text: string,
  _sentences: string[],
  tokens: string[]
): SignalResult {
  if (tokens.length < 10) {
    return { raw: 0, normalized: 50, detail: "Too few tokens for entropy analysis." };
  }

  const h = shannonEntropy(tokens);

  // Natural human range approximately 3.5–5.5 bits
  // Deviation from this range → elevated AI suspicion
  const lowerBound = 3.0;
  const upperBound = 5.5;
  const idealCenter = 4.5;

  let deviation: number;
  if (h < lowerBound) {
    deviation = (lowerBound - h) / lowerBound;
  } else if (h > upperBound) {
    deviation = (h - upperBound) / upperBound;
  } else {
    deviation = Math.abs(h - idealCenter) / (idealCenter - lowerBound) * 0.3;
  }

  const normalized = Math.round(Math.min(100, Math.max(0, deviation * 100)));

  return {
    raw: Math.round(h * 1000) / 1000,
    normalized,
    detail: `Token entropy: ${h.toFixed(3)} bits. Natural range: 3.0–5.5 bits. Deviation from expected range suggests atypical word-distribution pattern.`,
  };
}
