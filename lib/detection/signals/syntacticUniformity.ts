import type { SignalResult } from "@/types";

// Measures variance in sentence-opener patterns and punctuation rhythm.
// AI tends to produce homogeneous syntactic patterns even across varied content.
// Low opener variety + uniform punctuation density → AI-like → HIGH score.
//
// raw = (1 - opener_diversity) * 0.6 + (1 - punct_variance_normalized) * 0.4, range 0–1
// normalized = raw * 100

type OpenerCategory = "pronoun" | "article" | "conjunction" | "transition" | "other";

const PRONOUNS = new Set(["i", "we", "you", "he", "she", "they", "it"]);
const ARTICLES = new Set(["the", "a", "an"]);
const CONJUNCTIONS = new Set(["although", "while", "because", "since", "when", "if", "though", "whereas"]);
const TRANSITION_OPENERS = new Set([
  "furthermore", "moreover", "additionally", "however", "therefore", "thus",
  "consequently", "in", "for", "to", "this", "these", "such", "overall",
]);

function categorizeOpener(sentence: string): OpenerCategory {
  const first = sentence.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
  if (PRONOUNS.has(first)) return "pronoun";
  if (ARTICLES.has(first)) return "article";
  if (CONJUNCTIONS.has(first)) return "conjunction";
  if (TRANSITION_OPENERS.has(first)) return "transition";
  return "other";
}

function punctuationDensity(sentence: string): number {
  const punct = (sentence.match(/[,;:—–]/g) ?? []).length;
  const words = sentence.split(/\s+/).filter(Boolean).length;
  return words > 0 ? punct / words : 0;
}

export function syntacticUniformity(
  _text: string,
  sentences: string[],
  _tokens: string[]
): SignalResult {
  if (sentences.length < 3) {
    return { raw: 0.5, normalized: 50, detail: "Too few sentences for syntactic pattern analysis." };
  }

  const categories = sentences.map(categorizeOpener);
  const categoryCounts: Record<string, number> = {};
  for (const c of categories) categoryCounts[c] = (categoryCounts[c] ?? 0) + 1;

  // Opener diversity: entropy-like measure
  const total = categories.length;
  const openerEntropy = -Object.values(categoryCounts).reduce((sum, count) => {
    const p = count / total;
    return sum + p * Math.log2(p);
  }, 0);
  const maxEntropy = Math.log2(5); // 5 categories
  const openerDiversity = Math.min(1, openerEntropy / maxEntropy);

  // Punctuation rhythm uniformity
  const densities = sentences.map(punctuationDensity);
  const meanDensity = densities.reduce((a, b) => a + b, 0) / densities.length;
  const punctVariance = densities.reduce((a, b) => a + Math.pow(b - meanDensity, 2), 0) / densities.length;
  // High variance → more varied → human-like; normalize to 0–1
  const punctVarianceNorm = Math.min(1, punctVariance / 0.02);

  const raw = (1 - openerDiversity) * 0.6 + (1 - punctVarianceNorm) * 0.4;
  const normalized = Math.round(Math.min(100, Math.max(0, raw * 100)));

  const dominantCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0];

  return {
    raw: Math.round(raw * 1000) / 1000,
    normalized,
    detail: `Opener diversity (0–1): ${openerDiversity.toFixed(2)}. Dominant opener type: "${dominantCategory[0]}" (${dominantCategory[1]}/${total} sentences). Punctuation density variance: ${punctVariance.toFixed(4)}. Uniform patterns suggest AI generation.`,
  };
}
