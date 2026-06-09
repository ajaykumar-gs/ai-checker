import type { SignalResult } from "@/types";

// Type-token ratio (TTR) + MTLD-lite.
// Low diversity (few unique words relative to total) → AI-like → HIGH score.
// TTR alone penalizes long texts; MTLD-lite corrects for length.
//
// raw: weighted combination of inverted TTR and inverted MTLD-lite, 0–1
// normalized: raw * 100 (higher = more AI-like / lower diversity)

function computeTTR(tokens: string[]): number {
  if (tokens.length === 0) return 1;
  const unique = new Set(tokens).size;
  return unique / tokens.length;
}

// Simplified MTLD: walk tokens, track TTR until it drops below threshold, count segments
function computeMTLDLite(tokens: string[], threshold = 0.72): number {
  if (tokens.length < 10) return tokens.length;

  function segmentLength(toks: string[]): number {
    const seen = new Set<string>();
    let total = 0;
    for (const t of toks) {
      seen.add(t);
      total++;
      const ttr = seen.size / total;
      if (ttr < threshold) return total;
    }
    return total;
  }

  const forward = segmentLength(tokens);
  const backward = segmentLength([...tokens].reverse());
  return (forward + backward) / 2;
}

export function lexicalDiversity(
  _text: string,
  _sentences: string[],
  tokens: string[]
): SignalResult {
  if (tokens.length === 0) {
    return { raw: 0.5, normalized: 50, detail: "No tokens." };
  }

  const ttr = computeTTR(tokens);
  // Length-adjusted: expected TTR decreases with length; normalize by log
  const lengthFactor = Math.min(1, Math.log(tokens.length + 1) / Math.log(500));
  const adjustedTTR = ttr / Math.max(0.2, 1 - lengthFactor * 0.5);

  const mtld = computeMTLDLite(tokens);
  // Longer MTLD segments → higher diversity → less AI-like
  // Expected range 8–50; normalize so ≥40 is 0, ≤8 is 1
  const mtldScore = Math.max(0, Math.min(1, 1 - (mtld - 8) / 32));

  const raw = adjustedTTR * 0.5 + mtldScore * 0.5;
  // Invert: low diversity → high AI score
  const aiLikeRaw = 1 - Math.min(1, raw);
  const normalized = Math.round(aiLikeRaw * 100);

  return {
    raw: Math.round(raw * 1000) / 1000,
    normalized,
    detail: `TTR: ${(ttr * 100).toFixed(1)}% unique tokens. MTLD-lite segment length: ${mtld.toFixed(1)}. Lower diversity suggests AI-generated text.`,
  };
}
