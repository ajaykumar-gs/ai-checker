import type { SignalResult } from "@/types";

// Counts repeated bi-grams and tri-grams.
// High repetition of identical multi-word phrases → AI-like (formulaic output).
//
// raw = (repeated_bigrams + repeated_trigrams * 1.5) / total_ngrams, range 0–1
// normalized = clamp(raw * 200, 0, 100)  — scaled up since repetition tends to be sparse

function getNgrams(tokens: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(" "));
  }
  return ngrams;
}

function countRepeated(ngrams: string[]): number {
  const freq: Record<string, number> = {};
  for (const g of ngrams) freq[g] = (freq[g] ?? 0) + 1;
  return Object.values(freq).filter((c) => c > 1).reduce((a, b) => a + b, 0);
}

export function ngramRepetition(
  _text: string,
  _sentences: string[],
  tokens: string[]
): SignalResult {
  if (tokens.length < 4) {
    return { raw: 0, normalized: 0, detail: "Too few tokens for n-gram analysis." };
  }

  const bigrams = getNgrams(tokens, 2);
  const trigrams = getNgrams(tokens, 3);
  const repeatedBi = countRepeated(bigrams);
  const repeatedTri = countRepeated(trigrams);

  const totalNgrams = bigrams.length + trigrams.length;
  const raw = (repeatedBi + repeatedTri * 1.5) / Math.max(1, totalNgrams);
  const normalized = Math.round(Math.min(100, raw * 200));

  return {
    raw: Math.round(raw * 1000) / 1000,
    normalized,
    detail: `Repeated bi-grams: ${repeatedBi}, repeated tri-grams: ${repeatedTri} out of ${totalNgrams} total n-grams. High phrase-level repetition suggests formulaic generation.`,
  };
}
